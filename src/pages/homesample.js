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
  getFeaturedProductFromFirebase
} from "../server/firebase.config";
import { useLocation } from "react-router-dom";
import { firestoreFacade } from "../server/firestore.facades";
import { GiCampfire } from "react-icons/gi";
// import { useAlert } from "react-alert";

const Home = () => {
  // <!-- ////////// PRODUCT OF OBSIDIAN INC., WRITTEN AND DESIGNED BY GROOVE DEVELOPERS INC. YOU ARE PROHIBITED FROM USING OR EDITING
  // THIS APPLICATION WITHOUT INFORMING GROOVE DEVELOPERS INC AND OBSIDIAN INC. ///////////-->

  const [products, setProducts] = useState(null);
  const [category, setCategory] = useState(null);
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

    const catSub = getCategoriesFromFirebase("categories").subscribe((item) => {
      setCategory(item);
    });

    const query = new URLSearchParams(location.search);
    const subs = getOneProduct(realId).subscribe((item) => {
      // console.log(item)
      setCurrentProduct(item);
    });

    return () => {
      subscription.unsubscribe();
      subs.unsubscribe();
      catSub.unsubscribe();
    };
  }, [location]);

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

        <Row>
          <Col sm="6" md="6" className="h_t">
            <div className="hero_title">{currentProduct?.name}</div>
          </Col>

          <Col sm="6" md="6" className="cart_btn">
            <Button onClick={cart}> ADD TO CART</Button>
          </Col>
        </Row>

        <Row>
          <Col sm="12" md="12" className="hero_img">
            <img src={currentProduct?.image?.src} />
          </Col>
        </Row>

        <Container fluid>
          <Row className="row3">
            <Col sm="6" md="6" className="prod_desc">
              <div className="t_text">{currentProduct?.name}</div>

              <div className="s_text">{currentProduct?.category}</div>

              <div className="d_text">{currentProduct?.details}</div>
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
                    <Card>
                      <Card.Img variant="top" src={item?.image?.src} />

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
                        <Card.Title>{item?.name}</Card.Title>
                        <Card.Text>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: `${item?.details.substring(0, "100")}...`,
                            }}
                          ></div>
                        </Card.Text>

                        <Link to={`/home?id=${item.id}`}>
                          <Button variant="primary">Go somewhere</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
