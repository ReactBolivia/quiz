import React, { Component } from 'react';
// import logo from './logo.svg';
import '../App.css';
import  questions from '../assets/questions';
import { Container, Row, Col, Form, Button, Collapse } from 'react-bootstrap';
		// {
		// 	"question": "11. Elija la forma correcta de ingresar una imagen?",
		// 	"answers": ["<img src='foto.jpg'>***", "<imagen src='foto.jpg'>", "<img href='foto.jpg'>"],
		// 	"index_correct_answer": 0
		// },

		// {
		// 	"question": "12. ¿Cómo definimos un color en sistema hexadecimal? ",
		// 	"answers": ["<beige>", "<245,,245,220>", "<#F5F5DC>****"],
		// 	"index_correct_answer": 2
		// },

		// {
		// 	"question": "13. ¿Qué etiquetas pueden figurar en la sección <head>? ",
		// 	"answers": ["<style>, <meta>, <table>", "<link>, <title>, <base,>***", "<link>, <meta>, <p>"],
		// 	"index_correct_answer": 1
		// },

		// {
		// 	"question": "14. ¿Cómo mandamos un e-mail a partir de un vínculo? ",
		// 	"answers": [
		// 		"<a mail='alguien@yahoo.com'>...</a>",
		// 		"<a mailto='alguien@yahoo.com'>...,</a>",
		// 		"<a href='mailto:alguien@yahoo.com'>...</a>***"
		// 	],
		// 	"index_correct_answer": 2
		// },

		// {
		// 	"question": "15. ¿Qué es cellspadding? ",
		// 	"answers": [
		// 		"Define el espacio entre celdas de una tabla",
		// 		"Define los títulos de una tabla",
		// 		"Define el espacio entre el borde de la celda y su contenido***"
		// 	],
		// 	"index_correct_answer": 2
		// },

		// {
		// 	"question": "16. ¿Cómo definimos un texto alternativo para una imagen? ",
		// 	"answers": [
		// 		"<img src='foto.jpg' alt='texto alternativo'>",
		// 		"<img src='foto.jpg' value='texto alternativo'>",
		// 		"<img src='foto.jpg' text='texto alternativo>"
		// 	],
		// 	"index_correct_answer": 0
		// },

		// {
		// 	"question": "17. ¿Qué etiqueta define un salto de línea? ",
		// 	"answers": ["<br>***", "<brea,k>", "<linebreak>"],
		// 	"index_correct_answer": 0
		// },

		// {
		// 	"question": "18. ¿Cómo colocamos una imagen de fondo en una celda de una tabla? ",
		// 	"answers": [
		// 		"<tr bgcolor='...'>...</tr>",
		// 		"<tr background='...'>...,</tr>",
		// 		"<td background='...'>...</td>***"
		// 	],
		// 	"index_correct_answer": 2
		// },

		// {
		// 	"question": "19. Elija la etiqueta que nos dá el título más grande ?",
		// 	"answers": ["<h1>", "<h6>", "<head>"],
		// 	"index_correct_answer": 0
		// },

		// {
		// 	"question": "20. ¿Cómo hacemos para abrir un vínculo en otra ventana? ",
		// 	"answers": [
		// 		"<a href='www.algunsitio.com' new>...</a>",
		// 		"<a href='www.algunsitio.com' target='_new'>...</a>",
		// 		"<a href='www.algunsitio.com' target='_blank'>...</a>"
		// 	],
		// 	"index_correct_answer": 2
		// }


const Questions = props => {
    return(
        questions[props.type].map((e, i) => {
            return(
                <Col 
                    key={i} md={12}>
                    <h4 key={i}>{e.question}</h4>
                    {
                        e.answers.map((answer, j) => {
                            return(
                                <Form.Check 
                                    key={j}
                                    type={'radio'}
                                    id={`default-radio`}
                                    label={answer}
                                />
                            );
                        })
                    }
                </Col>
            );
        })
    );
}

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showForm: false,
            isSubmitted: false,
        };
    }

    render(){
        return (
            <div className="App">
                <Container fluid>
                    <Row>
                        <Col md={4} style={{backgroundColor: '#212121'}}>
                            <p style={{color: '#fff'}}>PUBLICIDAD PARA EL EVENTO</p>
                        </Col>
                        <Col md={8} style={{backgroundColor: '#f9f9f9'}}>
                            <h1> CUESTIONARIO</h1>  
                            <h2> REACT BOLIVIA WORKSHOP</h2>  
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nombre y apellidos</Form.Label>
                                    <Form.Control type="email" placeholder="Tu nombre completo" />
                                </Form.Group>
                                
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control type="email" placeholder="Tu correo electrónico" />
                                    <Form.Text className="text-muted" >
                                        Verifica que tu correo electrónico sea el correcto, pues lo utilizaremos para contactarte y mandarte contenido promocional.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Género</Form.Label> <br/>
                                    <Form.Check inline label="Masculino" type={'radio'} id={`inline-radio-1`} />
                                    <Form.Check inline label="Femenino" type={'radio'} id={`inline-radio-2`} />
                                    <Form.Text className="text-muted" >
                                        Solo puedes llenar el cuestionario una vez, si demostramos que lo hiciste más de una vez, eliminaremos tu postulación. <br/>
                                        Tendrás 15 minutos para resolver todo el cuestionario, buena suerte 😉
                                    </Form.Text>
                                </Form.Group>
                                <Button 
                                    onClick={() => this.setState({showForm: true})}
                                    variant="outline-success" size="lg" block style={{marginTop: 50, marginBottom: 25}}>
                                    Entiendo, empezar
                                </Button>
                                <Collapse in={this.state.showForm}>
                                    <div id="example-collapse-text">
                                        <Questions
                                            type="HTML"/>
                                        <Questions
                                            type="CSS"/>
                                    </div>
                                </Collapse>

                                <Button 
                                    style={{marginTop: 25, marginBottom: 50}}
                                    disabled={!this.state.isSubmitted}
                                    variant="outline-primary" 
                                    type="submit"
                                    size="lg" block >
                                    Enviar
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
            );
    }
}

export default App;
