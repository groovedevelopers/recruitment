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

  const [cart, setCart] = useState([]);


  useEffect(() => {
    const subscription = userCart$.subscribe((item) => {
    
      setCart(item);
    });

    return () => {
      subscription.unsubscribe();
    };
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

              <div id="myDropdown" className="dropdown-content">
                <Row>
                  {cart.map((item) => (
                    <React.Fragment key={item.id}>
                      <Col sm="6" md="6">
                        <div>{item?.name}</div>

                        <div>{item?.price}</div>
                      </Col>
                      <Col sm="6" md="6">
                        <img src={item?.cartImage} alt="productImage" />
                      </Col>
                    </React.Fragment>
                  ))}

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
