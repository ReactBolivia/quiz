import React, { Component } from 'react';
import './style.css'
import  questions from '../assets/questions';
import  iconReact from '../assets/favicon.png';
import  banner from '../assets/banner.png';
import { 
    Container, Row, Col, 
    Form, Button, Collapse, 
    Fade, Jumbotron, Alert,
    Figure, Image, ListGroup
} from 'react-bootstrap';
import { BarChart  } from 'react-chartkick'
import Chart from 'chart.js'
import axios from 'axios';

const formatData = (num) =>  num >= 10 ? num : `0${num}` 


const Timer = props => {
    if(props.start){
        return (
            <div style={{padding: 5, border: '1px solid #1F1F21', borderRadius: 5, backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
                <span style={{padding: 5, textAlign:'center', fontWeight: 'bold', fontSize: 16}}> 
                    {`${formatData(props.min)}:${formatData(props.sec)}`} 
                </span>
            </div>
        );
    }
    return null;
    
}

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
                        <div style={{marginLeft: 20, marginBottom: 10}}>
                        {
                            e.answers.map((answer, j) => {
                                return(
                                    <Form.Check 
                                        checked={j == e.checked}
                                        key={j}
                                        type={'radio'}
                                        id={`default-radio`}
                                        label={answer}
                                        disabled={e.disabled}
                                        onChange={() => props._checkField(props.type, i, j)}
                                    />
                                );
                            })
                        }
                        </div>
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
            age: 0,
            profesion: '',
            gender: null,
            showForm: false,
            quizStarted: false,
            isLoadingSuccessMsgError: null,
            isSubmitted: false,
            results: [],
            HTML: questions['HTML'].map((e, i) => { return{...e, checked: null, disabled: false,} }),
            CSS: questions['CSS'].map((e, i) => { return{...e, checked: null, disabled: false,} }),
            JS: questions['JS'].map((e, i) => { return{...e, checked: null, disabled: false,} }),
            isLoading: false,
            isLoadingSuccess: true,
            isLoadingSuccessMsg: '',
            timer: {
                min: 15, 
                sec: 0,
            },
            disableStart: false,
        };

        this.startCounter = this.startCounter.bind(this);
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
        const norm = (n - min) / (max - min);
        return norm;
    }

    getResults(){
        const { CSS, HTML, JS } = this.state;
        const cssCorrect = CSS.filter(e => e.checked == e.index_correct_answer);
        const htmlCorrect = HTML.filter(e => e.checked == e.index_correct_answer);
        const jsCorrect = JS.filter(e => e.checked == e.index_correct_answer);
        const sum = cssCorrect.length + htmlCorrect.length + jsCorrect.length;
        const cssAnswer = CSS.map(e => { return e.checked ? { marked: e.checked, question: e.question } : null }).filter(e => e != null);
        const htmlAnswer = HTML.map(e => { return e.checked ? { marked: e.checked, question: e.question } : null }).filter(e => e != null);
        const jsAnswer = JS.map(e => { return e.checked ? { marked: e.checked, question: e.question } : null }).filter(e => e != null);
        return {
            results: {
                css: cssCorrect, 
                html: htmlCorrect,
                js: jsCorrect,
            },
            userResults: {
                css: cssAnswer, 
                html: htmlAnswer,
                js: jsAnswer,
            },
            score: this.normalize(sum)
        };        
    }

    startCounter(){
        this.t = setInterval(() => this.thick(), 1000);
    }


    thick(){
        const { JS, HTML, CSS } = this.state;
        const { min, sec, } = this.state.timer;
        if(min === 0 && sec === 0){
            clearInterval(this.t);
            const disable_js = JS.map(e => {  return {...e, disabled: true} });
            const disable_html = JS.map(e => {  return {...e, disabled: true} });
            const disable_css = JS.map(e => {  return {...e, disabled: true} });
            this.setState({
                JS: disable_js,
                CSS: disable_css,
                HTML: disable_html,
                disableStart: true,
            });
            return;
        }
        let newSec;
        let newMin;
        if(sec > 0){
            newSec = sec - 1;
            newMin = min;
        }
        if(sec === 0){
            newSec = 59;
            newMin = min - 1;
        }
        this.setState({
            timer: {
                ...this.state.timer,
                sec: newSec,
                min: newMin,
            }
        });
    }

    async submit(){
        const { email, name, gender, CSS, HTML, age, profesion } = this.state;
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
        this.setState({
            isLoading: true,
            isLoadingSuccess: true,
        });
        const percentage = (data.score * 100).toFixed(2);
        const form = {
            encuestaId: 4,
            preguntas:[
                {
                    respuesta: name,
                    id: 25,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
                {
                    respuesta: age,
                    id: 26,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
                {
                    respuesta: profesion,
                    id: 27,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
                {
                    respuesta: email,
                    id: 24,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
                {
                    respuesta: JSON.stringify(data.userResults),
                    id: 28,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
                {
                    respuesta: data.score,
                    id: 29,
                    fecha_creacion: '2019-05-07',
                    fecha_creacion: '2019-05-07',
                },
            ]
        };
        try{
            let response =
            await axios.post(`https://www.isoc.bo/isocbo/public/api/survey`, form, {
            // await axios.post(`http://localhost:8000/api/survey`, form, {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            })
            this.setState({
                isLoading: false
            });
            console.log(response);
            
            if(response.data.success){
                this.setState({
                    quizStarted: false,
                    disableStart: true,
                    isLoading: false,
                    isLoadingSuccess: true,
                    isLoadingSuccessMsgError: 'success',
                    isLoadingSuccessMsg: 'Su formulario fue enviado con éxito, debajo podrá ver sus resultados',
                    isSubmitted: true,
                    results: {
                        data: [['CSS', data.results.css.length], ['HTML', data.results.html.length], ['JS', data.results.js.length]],
                        score: percentage
                    }
                });
                return;
            }else{
                this.setState({
                    isLoading: false,
                    isLoadingSuccess: false,
                    isLoadingSuccessMsg: 'Hubo un error al enviar su cuestionario, inténtelo nuevamente',
                    isLoadingSuccessMsgError: 'danger',
                });
                return;
            }
          }catch(e){
            console.log(e)
            this.setState({
                isLoading: false,
                isLoadingSuccess: false,
                isLoadingSuccessMsg: 'Hubo un error al enviar su cuestionario, inténtelo nuevamente',
                isLoadingSuccessMsgError: 'danger',
            });
            return;
          }
        
    }

    render(){
        const {  min, sec } = this.state.timer;
        return ( 
            <div className="App">
                <Container fluid>
                    <Row>
                        <Col md={8} style={{backgroundColor: '#f9f9f9'}}>
                            <Jumbotron className="jumbotron-container" fluid style={{padding: 30}}>
                                <Image src={banner} fluid style={{marginTop: 20, borderRadius: 10}} />

                                <h1 style={{textAlign: 'center', color: '#fff'}}> React JS Workshop</h1>  
                                <p style={{color: '#fff'}}>
                                    En esta ocasión la comunidad organiza un <span style={{fontWeight: 'bold'}}>taller práctico</span> el 18 de mayo 
                                     en el que seleccionaremos solamente a las <span style={{fontWeight: 'bold'}}>30 mejores postulaciones</span> mediante un cuestionario de HTML, CSS y JS. <br/>
                                    Esto es debido a que tenemos espacio limitado para 30 personas, en los ambientes de la Universidad Privada Del Valle que
                                    es nuestra auspiciadora en esta ocasión, si conoces estas tecnologías únete a este desafío 💪 y aprende la tecnología web más moderna, React, por favor llene todos los campos.
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
                                <Form.Group controlId="formName">
                                    <Form.Label>Edad</Form.Label>
                                    <Form.Control 
                                        name="age"
                                        value={this.state.age}
                                        onChange={this.fillForm.bind(this)}
                                        type="number" 
                                        placeholder="Tu edad" />
                                </Form.Group>
                                <Form.Group controlId="formName">
                                    <Form.Label>Profesión</Form.Label>
                                    <Form.Control 
                                        name="profesion"
                                        value={this.state.profesion}
                                        onChange={this.fillForm.bind(this)}
                                        type="text" 
                                        placeholder="Tu profesión" />
                                    <Form.Text className="text-muted" >
                                        Queremos saber si eres estudiante, o tienes una profesión específica
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
                                    variant="outline-success" size="lg" block style={{marginTop: 50, marginBottom: 25}}
                                    disabled={this.state.disableStart}>
                                    Entendido, empezar 😎
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
                                <Col md={{span: 4, offset: 5}}>
                                <h4 style={{textAlign: 'center'}}>Tu puntaje</h4>
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
                                            min={0} max={10}
                                            data={this.state.results.data} />
                                    </div>
                                </Fade>
                            </Col>
                            }
                        </Col>
                        <Col style={{paddingTop: 20}} md={4} className="marketing-container">
                            <ListGroup>
                            <ListGroup.Item><strong>Contacto:</strong></ListGroup.Item>
                            <ListGroup.Item> (+591) 70162630, Pablo M. Jordan</ListGroup.Item>
                            <ListGroup.Item> (+591) 67341446, Arnol Robles</ListGroup.Item>
                            <ListGroup.Item> (+591) 60684585, David Paredes</ListGroup.Item>
                            <ListGroup.Item> (+591) 60101082, Mauricio de la Quintana </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </Container>
                {   this.state.quizStarted &&
                    <div style={{display: 'block', width: '100%', height: 60, padding: 20}}>
                        <div style={{position: 'fixed', padding: 20, bottom: 20, left: '50%', height: 50, width: 200, textAlign: 'center', }}>
                            <Timer
                                start={this.state.quizStarted}
                                min={min}
                                sec={sec}/>
                        </div>
                    </div>
                }
            </div>
            );
    }
}

export default App;
