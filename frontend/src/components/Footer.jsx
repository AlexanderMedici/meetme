import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  const currrentYear = new Date().getFullYear();
  return (
    <footer>
      <Container>
        <Row>
          <Col className="text-center py-3 text-light opacity-75">
            MeetMe {currrentYear}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
