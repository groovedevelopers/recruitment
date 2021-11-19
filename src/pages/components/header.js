import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "../../assets/css/style.css";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo/logo.png";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { userCart$ } from "../../server/firebase.config";
import { firstValueFrom } from "rxjs";
import Button from "@restart/ui/esm/Button";
// import { useAlert } from "react-alert";

const Header = () => {
  // <!-- ////////// PRODUCT OF OBSIDIAN INC., WRITTEN AND DESIGNED BY GROOVE DEVELOPERS INC. YOU ARE PROHIBITED FROM USING OR EDITING
  // THIS APPLICATION WITHOUT INFORMING GROOVE DEVELOPERS INC AND OBSIDIAN INC. ///////////-->

  const [cart, setCart] = useState(null);

  //   const cart$ = userCart$.pipe(
  //     tap((item) => {
  //       // console.log(item)

  //       item?.products ? (setCart ( item?.products) ): [];
  //     }),
  //   );

  const effect = useEffect(() => {
    firstValueFrom(userCart$)
      .then((item) => {
        // console.log(item);
        setCart(item);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Container fluid className="header">
        <Row>
          <Col sm="6" md="6" className="h_logo">
            <img src={logo} />
          </Col>

          <Col sm="6" md="6" className="h_cart">
            <div className="dropdown">
              <AiOutlineShoppingCart className="icons dropbtn"></AiOutlineShoppingCart>
              {cart?.length}

              <div id="myDropdown" class="dropdown-content">
                <Row>
                  <Col sm="6" md="6">
                    <div>{cart?.name}</div>

                    <div>${cart?.price}</div>
                  </Col>

                  <Col sm="6" md="6">
                    <img src={cart?.image?.src} />
                  </Col>

                  <Col sm="12" md="12">
                    <Button> Clear</Button>
                  </Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Header;
