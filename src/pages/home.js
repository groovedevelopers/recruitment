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
  getOneProduct,
  getCategoriesFromFirebase,
  getFeaturedProductFromFirebase,
} from "../server/firebase.config";
import { useLocation } from "react-router-dom";
import { firestoreFacade } from "../server/firestore.facades";
import { GiCampfire } from "react-icons/gi";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { firstValueFrom } from "rxjs";
// import { useAlert } from "react-alert";

const Home = () => {
  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
  const [featured, setFeatured] = useState(null);
  const [page, setPage] = useState(1);
  const [currentProduct, setCurrentProduct] = useState(null);
  const idRef = useRef(null);

  let url = window.location.href;
  let id = queryString.parse(url);
  const realId = Object.values(id)[0];

  const location = useLocation();

  const effect = useEffect(() => {
    const subscription = getProductFromFirebase("products").subscribe(
      (item) => {
        setProducts(item);
      }
    );

    const featuredSubs = getFeaturedProductFromFirebase("products").subscribe(
      (item) => {
        setFeatured(item);
        console.log(item);
      }
    );

    const catSub = getCategoriesFromFirebase("categories").subscribe((item) => {
      setCategory(item);
    });

    // const query = new URLSearchParams(location.search);
    // const subs = getOneProduct(realId).subscribe((item) => {
    //   // console.log(item)
    //   setCurrentProduct(item);
    // });

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
const showPrevious = ({item}) => {
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

  const cart = async () => {
    const name = currentProduct?.name;
    const price = currentProduct?.price;
    const productId = currentProduct?.id;
    const cartImage = currentProduct?.image?.src;
    const products = { name, price, productId, cartImage };
    // console.log(products)

    await firestoreFacade.cart(products);
  };

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
                  <Button onClick={cart}> ADD TO CART</Button>
                </Col>
              </Row>

              <Row>
                <Col sm="12" md="12" className="hero_img">
                  <img src={item?.image?.src} />
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

          <Col sm="6" md="6">
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
          </Col>
        </Row>

        <Row>
          <Col sm="12" md="3">
            <div className="cat_head">Category</div>

            <div className="cat_body">
              {category?.length === 0 ? (
                <></>
              ) : (
                category?.map((item) => (
                  <div className="cat_list">
                    <input type="checkbox" name="" />
                    &nbsp;
                    <span>{item?.name}</span>
                  </div>
                ))
              )}
            </div>

            <div className="cat_head">Categoty</div>
            <div className="cat_body">
              <div className="cat_list">
                <input type="checkbox" name="" />
                &nbsp;
                <span>Lower than $20</span>
              </div>

              <div className="cat_list">
                <input type="checkbox" name="" />
                &nbsp;
                <span>$20 - $100</span>
              </div>

              <div className="cat_list">
                <input type="checkbox" name="" />
                &nbsp;
                <span>$100 - $200</span>
              </div>

              <div className="cat_list">
                <input type="checkbox" name="" />
                &nbsp;
                <span>More than $200</span>
              </div>
            </div>
          </Col>

          <Col sm="12" md="9">
            <Row>
              {products?.length === 0 ? (
                <></>
              ) : (
                products?.map((item) => (
                  <Col sm="12" md="4">
                    <Card className="product_card">
                      <Card.Img variant="top" src={item?.image?.src} />
                      <Link to={`/home?id=${item.id}`}>
                        <Button className="add_cart_btn" variant="primary">
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
                      <Card.Body>
                        <Card.Text>{item?.category}</Card.Text>
                        <Card.Title>{item?.name}</Card.Title>
                        <Card.Text>${item?.price}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
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
                      onClick={() => showNext({ item: products[products.length - 1] })}
                    >
                      {" "}
                      <GrFormNext
                        className="icons"
                       
                      ></GrFormNext>{" "}
                      Next
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
