import React, { useEffect, useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Header from "./components/header";
import "../assets/css/style.css";
import { Link } from "react-router-dom";
import Button from "@restart/ui/esm/Button";
import img1 from "../assets/images/img1.png";
import img_s1 from "../assets/images/img_s1.png";
import img_s2 from "../assets/images/img_s2.png";
import img_s3 from "../assets/images/img_s3.png";
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import queryString from "query-string";
import {
  getProductFromFirebase,
  getCategoriesFromFirebase,
  getFeaturedProductFromFirebase,
  addToCartFirebase,
} from "../server/firebase.config";
import { useLocation } from "react-router-dom";
import { GiCampfire } from "react-icons/gi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BehaviorSubject, combineLatest, firstValueFrom } from "rxjs";
import { map, take } from "rxjs/operators";
// import { useAlert } from "react-alert";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [featured, setFeatured] = useState(null);
  const [page, setPage] = useState(1);

  const checkedCategories = useRef([]);

  const selectedCategories$ = useRef(new BehaviorSubject([]));
  const selectedPrice$ = useRef(new BehaviorSubject({min:0, max:Infinity}));
  const products$ = useRef(new BehaviorSubject([]));

  useEffect(() => {
    getProductFromFirebase("products")
    .pipe(take(1))
    .subscribe((item) => {
      products$.current.next(item);
    });
    const subscription = combineLatest([
      selectedCategories$.current,
      selectedPrice$.current,
      products$.current,
    ])
      .pipe(
        map(([selectedCategories, selectedPrice, products]) => {
          return products.filter(item => {
            const category = item.category[0]
            return selectedCategories.length  === 0? true :  selectedCategories.includes(category)
          })
          .filter(item => {

            return item.price >=  selectedPrice.min &&   item.price <= selectedPrice.max
          });
        })
      )
      .subscribe((item) => {
        setProducts(item);
      });

   

    const featuredSubs = getFeaturedProductFromFirebase("products").subscribe(
      (item) => {
        setFeatured(item);
        // console.log(item);
      }
    );

    const catSub = getCategoriesFromFirebase("categories").subscribe((item) => {
      setCategory(item);
    });

    return () => {
      subscription.unsubscribe();
      featuredSubs.unsubscribe();
      catSub.unsubscribe();
    };
  }, []);

  const showNext = ({ item }) => {
    if (products.length === 0) {
      //use this to show hide buttons if there is no records
    } else {
      const fetchNextData = async () => {
        firstValueFrom(getProductFromFirebase())
          .then((item) => {
            // console.log(item);
            setProducts(item);
            setPage(page + 1);
          })
          .catch((error) => {
            console.log(error);
          });
      };
      fetchNextData();
    }
  };

  //previous button function
  const showPrevious = ({ item }) => {
    const fetchPreviousData = async () => {
      firstValueFrom(getProductFromFirebase())
        .then((item) => {
          // console.log(item);
          setProducts(item);
          setPage(page - 1);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchPreviousData();
  };

  const cart = async (item) => {
    const name = item?.name;
    const price = item?.price;
    const productId = item?.id;
    const cartImage = item?.image?.src;
    const products = { name, price, productId, cartImage };
    await addToCartFirebase(products);
  };

  const handleCheckBox = (event) => {
    if (event.target.checked) {
      checkedCategories.current = [
        ...checkedCategories.current,
        event.target.value,
      ];
    } else {
      checkedCategories.current = checkedCategories.current.filter(
        (item) => item !== event.target.value
      );
    }

    selectedCategories$.current.next(checkedCategories.current)
    console.log(checkedCategories.current);
  };

  const handleRadioChange =  (event, value) =>{

   selectedPrice$.current.next(value)
  }

  return (
    <div>
      <Container fluid className="main">
        <Header></Header>

        {featured?.length === 0 ? (
          <></>
        ) : (
          featured?.map((item) => (
            <div>
              <Row>
                <Col sm="6" md="6" className="h_t">
                  <div className="hero_title">{item?.name}</div>
                </Col>

                <Col sm="6" md="6" className="cart_btn">
                  <Button
                    onClick={() => {
                      cart(item);
                    }}
                  >
                    {" "}
                    ADD TO CART
                  </Button>
                </Col>
              </Row>

              <Row>
                <Col sm="12" md="12" className="hero_img">
                  <img src={item?.image?.src} />
                  <Button
                    onClick={() => {
                      cart(item);
                    }}
                  >
                    {" "}
                    ADD TO CART
                  </Button>
                </Col>
              </Row>

              <Container fluid>
                <Row className="row3">
                  <Col sm="6" md="6" className="prod_desc">
                    <div className="t_text">{item?.name}</div>

                    <div className="s_text">{item?.category}</div>

                    <div className="d_text">{item?.details}</div>
                  </Col>
                  <Col sm="6" md="6" className="prod_desc2">
                    <div className="t_text">People also buy</div>
                    <div className="mini_img">
                      <div>
                        <img src={img_s1} />
                      </div>

                      <div>
                        <img src={img_s2} />
                      </div>

                      <div>
                        <img src={img_s3} />
                      </div>
                    </div>
                  </Col>

                  <Col className="prod_desc2">
                    <div className="right">
                      <div className="t_text">Details</div>
                      <div className="d_text">Size: 1020 x 1020 pixel</div>
                      <div className="d_text">Size: 15 mb</div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          ))
        )}
        <Row>
          <Col sm="6" md="6" className="h_t">
            <div>
              <span className="hero_title">Photography /</span>
              <span>Premium Photos</span>
            </div>
          </Col>

          {/* <Col sm="6" md="6">
            <div className="right">
              <span>
                {" "}
                <AiOutlineArrowUp className="icons"></AiOutlineArrowUp>{" "}
                <AiOutlineArrowDown className="icons"></AiOutlineArrowDown>{" "}
              </span>
              Sort By &nbsp;
              <span>
                Price{" "}
                <RiArrowDropDownLine className="icons"></RiArrowDropDownLine>
              </span>
            </div>
          </Col> */}
        </Row>

        <Row>
          <Col sm="12" md="3">
            <div className="cat_head">Category</div>

            <div className="cat_body">
              {category?.map((item) => (
                <div className="cat_list">
                  <input
                    type="checkbox"
                    name=""
                    value={item.name}
                    onChange={handleCheckBox}
                  />
                  &nbsp;
                  <span>{item?.name}</span>
                </div>
              ))}
            </div>

            <div className="cat_head">Category</div>
            <div className="cat_body">
              <div className="cat_list">
                <input type="radio" name="pricelist" onChange={(event) => {handleRadioChange(event, {min:0, max:20})}}/>
                &nbsp;
                <span>Lower than $20</span>
              </div>

              <div className="cat_list">
                <input type="radio" name="pricelist" onChange={(event) => {handleRadioChange(event, {min:20, max:100})}}/>
                &nbsp;
                <span>$20 - $100</span>
              </div>

              <div className="cat_list">
                <input type="radio" name="pricelist" onChange={(event) => {handleRadioChange(event, {min:100, max:200})}}/>
                &nbsp;
                <span>$100 - $200</span>
              </div>

              <div className="cat_list">
                <input type="radio" name="pricelist" onChange={(event) => {handleRadioChange(event, {min:200, max:Infinity})}}/>
                &nbsp;
                <span>More than $200</span>
              </div>
            </div>
          </Col>

          <Col sm="12" md="9">
            <Row>
              {products.map((item) => (
                <Col sm="12" md="4">
                  <Card className="product_card">
                    <Card.Img variant="top" src={item?.image?.src} />
                    <Link to={`/home?id=${item.id}`}>
                      <Button
                        onClick={() => {
                          cart(item);
                        }}
                        className="add_cart_btn"
                        variant="primary"
                      >
                        Add to Cart
                      </Button>
                    </Link>

                    {item?.featured === "true" ? (
                      <div class="badge-featured">
                        <GiCampfire></GiCampfire> &nbsp;Featured
                      </div>
                    ) : (
                      <> </>
                    )}

                    {item?.bestseller === "true" ? (
                      <div class="badge-bestseller">Bestseller</div>
                    ) : (
                      <> </>
                    )}
                    <Card.Body className="card_body">
                      <Card.Text>{item?.category}</Card.Text>
                      <Card.Title>{item?.name}</Card.Title>
                      <Card.Text>{item?.price}</Card.Text>
                    </Card.Body>
                  </Card>
                  <br />
                </Col>
              ))}
            </Row>

            <div className="pagination">
              <span>
                {" "}
                {
                  //show previous button only when we have items
                  //pass first item to showPrevious function
                  page === 1 ? (
                    ""
                  ) : (
                    <Button onClick={() => showPrevious({ item: products[0] })}>
                      {" "}
                      <GrFormPrevious className="icons"></GrFormPrevious>{" "}
                      Previous
                    </Button>
                  )
                }
              </span>
              &nbsp; &nbsp;
              <span> </span>
              &nbsp;&nbsp;
              <span>
                {
                  //show next button only when we have items
                  //pass last item to showNext function
                  //   products.length > 5 ? (

                  <Button
                    onClick={() =>
                      showNext({ item: products[products.length - 1] })
                    }
                  >
                    {" "}
                    <GrFormNext className="icons"></GrFormNext> Next
                  </Button>

                  //   ) : (
                  //     <></>
                  //   )
                }
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
