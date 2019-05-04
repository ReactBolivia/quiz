import React, { Component } from 'react';
// import logo from './logo.svg';
// import '../App.css';
import './style.css'
import  questions from '../assets/questions';
import { 
    Container, Row, Col, 
    Form, Button, Collapse, 
    Fade, Jumbotron, Alert,
    Figure
} from 'react-bootstrap';
import { BarChart  } from 'react-chartkick'
import Chart from 'chart.js'
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
        <>
        <div className={`title-container ${props.type.toLowerCase()}-title`}>
            <h2 className="title">{props.type}</h2>
        </div>
        <>
        {
            props.data.map((e, i) => {
                return(
                    <Col 
                        key={i} md={12}>
                        <h4 key={i}>{e.question}</h4>
                        {
                            e.answers.map((answer, j) => {
                                return(
                                    <Form.Check 
                                        checked={j == e.checked}
                                        key={j}
                                        type={'radio'}
                                        id={`default-radio`}
                                        label={answer}
                                        onChange={() => props._checkField(props.type, i, j)}
                                    />
                                );
                            })
                        }
                    </Col>
                );
            })
        }
        </>
        </>
    );
}

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            alias: '',
            email: '',
            name: '',
            gender: null,
            showForm: false,
            quizStarted: false,
            isLoadingSuccessMsgError: null,
            isSubmitted: false,
            results: [],
            HTML: questions['HTML'].map((e, i) => { return{...e, checked: null} }),
            CSS: questions['CSS'].map((e, i) => { return{...e, checked: null} }),
            JS: questions['JS'].map((e, i) => { return{...e, checked: null} }),
            isLoading: false,
            isLoadingSuccess: true,
            isLoadingSuccessMsg: '',
        };
    }

    checkField(type, indexAnswer, indexOption){
        // copy type questionare
        const copy = this.state[type];
        // update right index checking field 'checked' as the index of the option chosen
        const updated = copy.map((e, i) => {
            if(indexAnswer === i){
                return{
                    ...e, checked: indexOption
                }
            }
            return e;
        });
        this.setState({[type]: updated});
    }

    fillForm({target}){
        this.setState({
            [target.name]: target.value
        });
    }

    startTest(){
        const { showForm, email, name, gender } = this.state;
        if(!this.validatePersonalData()){
            this.setState({
                isLoading: false,
                isLoadingSuccess: false,
                isLoadingSuccessMsg: 'Debe llenar todos los campos',
                isLoadingSuccessMsgError: 'warning',
            });
            return;
        }
        this.setState({showForm: true, quizStarted: true});
        this.startCounter();
    }

    validatePersonalData(){
        const { email, name, gender } = this.state;
        return !(email.trim() == '' || name.trim() == '' || !gender);
    }
    /**
     * @param min: Minimun value accepted to submit
     * @param max: Max value accepted to submit
     * @param n: Number to normalize
     */
    normalize(n, min=0, max=30){
        console.log(n)
        const norm = (n - min) / (max - min);
        console.log(norm)
        return norm;
    }

    getResults(){
        const { CSS, HTML, JS } = this.state;
        const cssCorrect = CSS.filter(e => e.checked == e.index_correct_answer);
        const htmlCorrect = HTML.filter(e => e.checked == e.index_correct_answer);
        const jsCorrect = JS.filter(e => e.checked == e.index_correct_answer);
        const sum = cssCorrect.length + htmlCorrect.length + jsCorrect.length;
        console.log(cssCorrect, htmlCorrect)
        return {
            css: cssCorrect, 
            html: htmlCorrect,
            js: jsCorrect,
            score: this.normalize(sum)
        };        
    }

    startCounter(){}

    submit(){
        const { email, name, gender, CSS, HTML, } = this.state;
        if(!this.validatePersonalData()){
            this.setState({
                isLoading: false,
                isLoadingSuccess: false,
                isLoadingSuccessMsg: 'Debe llenar todos los campos',
                isLoadingSuccessMsgError: 'warning',
            });
            return;
        }
        const data = this.getResults();
        console.log(data);
        this.setState({
            isLoading: true
        });
        const percentage = (data.score * 100).toFixed(2);
        console.log(data.score * 100)
        if(true){
            this.setState({
                isLoading: false,
                isLoadingSuccess: true,
                isLoadingSuccessMsgError: 'success',
                isLoadingSuccessMsg: 'Su formulario fue enviado con éxito, debajo podrá ver sus resultados',
                isSubmitted: true,
                results: {
                    data: [['CSS', data.css.length], ['HTML', data.html.length], ['JS', data.js.length]],
                    score: percentage
                }
            });
        }
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
                            <Jumbotron className="jumbotron-container" fluid style={{padding: 30}}>
                                <h1 style={{textAlign: 'center', color: '#fff'}}> React Bolivia Workshop</h1>  
                                <p style={{color: '#fff'}}>
                                    En esta ocasión la comunidad organiza un <span style={{fontWeight: 'bold'}}>taller práctico</span>
                                     en el que seleccionaremos solamente a las <span style={{fontWeight: 'bold'}}>30 mejores postulaciones</span>. <br/>
                                    Esto es debido a que tenemos espacio limitado para 30 personas, en los ambientes de la Universidad Del Valle que
                                    es nuestra auspiciadora en esta ocasión, por favor llene todos los campos.
                                </p>
                            </Jumbotron>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nombre y apellidos</Form.Label>
                                    <Form.Control 
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.fillForm.bind(this)}
                                        type="text" 
                                        placeholder="Tu nombre completo" />
                                    <Form.Text className="text-muted" >
                                        Se usarán las iniciales de tu nombre para publicar una lista de las notas. 
                                    </Form.Text>
                                </Form.Group>
                                
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Correo electrónico</Form.Label>
                                    <Form.Control 
                                        name="email"
                                        value={this.state.email}
                                        onChange={this.fillForm.bind(this)}
                                        type="email" 
                                        placeholder="Tu correo electrónico" />
                                    <Form.Text className="text-muted" >
                                        Verifica que tu correo electrónico sea el correcto, pues lo utilizaremos para contactarte y mandarte contenido promocional.
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Género</Form.Label> <br/>
                                    <Form.Check 
                                        onChange={() => this.setState({gender: 'masculino'})}
                                        checked={this.state.gender == 'masculino'}
                                        inline label="Masculino" type={'radio'} id={`inline-radio-1`} />
                                    <Form.Check                                         
                                        onChange={() => this.setState({gender: 'femenino'})}
                                        checked={this.state.gender == 'femenino'}
                                        inline label="Femenino" type={'radio'} id={`inline-radio-2`} />
                                    <Form.Text className="text-muted" >
                                        Solo puedes llenar el cuestionario una vez, si demostramos que lo hiciste más de una vez, eliminaremos tu postulación. <br/>
                                        Tendrás 15 minutos para resolver todo el cuestionario, buena suerte 😉
                                    </Form.Text>
                                </Form.Group>
                                <Button 
                                    onClick={() => this.startTest()}
                                    variant="outline-success" size="lg" block style={{marginTop: 50, marginBottom: 25}}>
                                    Entiendo, empezar
                                </Button>
                                <Collapse in={this.state.showForm}>
                                    <div id="example-collapse-text">
                                        <Questions
                                            _checkField={this.checkField.bind(this)}
                                            data={this.state.HTML}
                                            type="HTML"/>
                                        <Questions
                                            _checkField={this.checkField.bind(this)}
                                            data={this.state.CSS}
                                            type="CSS"/>
                                        <Questions
                                            _checkField={this.checkField.bind(this)}
                                            data={this.state.JS}
                                            type="JS"/>
                                    </div>
                                </Collapse>
                                {
                                    !this.state.isLoadingSuccess && 
                                    <Fade in={!this.state.isLoadingSuccess}>
                                        <Alert style={{fontWeight: 'bold', textAlign: 'center'}} variant={this.state.isLoadingSuccessMsgError}>
                                            {this.state.isLoadingSuccessMsg}
                                        </Alert>
                                    </Fade>
                                }
                                {   
                                    this.state.isSubmitted &&
                                    <Fade in={this.state.isSubmitted}>
                                        <Alert style={{fontWeight: 'bold', textAlign: 'center'}} variant={this.state.isLoadingSuccessMsgError}>
                                            {this.state.isLoadingSuccessMsg}
                                        </Alert>
                                    </Fade>
                                }
                                <Button 
                                    className="submit"
                                    style={{marginTop: 25, marginBottom: 50, }}
                                    disabled={this.state.isLoading || !this.state.quizStarted}
                                    variant="outline-primary" 
                                    size="lg" block 
                                    onClick={() => this.submit()}>
                                    { this.state.isLoading ? 'Subiendo...' : 'Enviar' }
                                </Button>
                            </Form>
                            { this.state.isSubmitted && 
                            <Col>
                                <Col md={{span: 4, offset: 4}}>
                                <div className="results">
                                    <span className="results-percentage" style={{color: '#fff'}}>{`${this.state.results.score}%`}</span>
                                </div>
                                </Col>
                                <Fade
                                    timeout={1000} 
                                    in={this.state.isSubmitted}>
                                    <div id="example-collapse-text" style={{marginBottom: 20}}>
                                        <BarChart 
                                            colors={["#EF476F", "#FF5722", "#4CD964"]}
                                            min={0} max={30}
                                            data={this.state.results.data} />
                                    </div>
                                </Fade>
                            </Col>
                            }
                        </Col>
                        
                    </Row>
                </Container>
            </div>
            );
    }
}

export default App;
