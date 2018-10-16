import React, {Component} from 'react';
import GoogleMapReact from 'google-map-react';
//import Image from 'react';
import marker from '../assets/baseline_place_black_18dp.png';
import firebase from 'firebase';
import {Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

//import navbar home
import Home from './Home';

export default class Map extends Component {
    constructor() {
        super();
        this.state = {
            places: [],
            categorias: [],
            checkSelecionados:[],
            modalp: false,
            modalc: false,
            placeName: [],
            categoryName: [],            
        };

        this.upgradePlace = this.upgradePlace.bind(this);
        this.upgradeCategory = this.upgradeCategory.bind(this);
        this.togglep = this.togglep.bind(this);
        this.togglec = this.togglec.bind(this);
        this.logout = this.logout.bind(this);       
    }

    upgradePlace(event){
      this.setState({placeName: event.target.value});
    }

    addPlace  = ev =>  {
        const category = {
            tipo: this.state.placeName,
        };

        const db = firebase.firestore();
        const userRef = db.collection('Places').add(category)
            .then(sucesso => {
                console.log('Dados inseridos: ' + sucesso);
            });
    }

    upgradeCategory(event){
        this.setState({categoryName: event.target.value});
    }

    addCategory  = ev =>  {
        const category = {
            tipo: this.state.categoryName,
        };

        const db = firebase.firestore();
        const userRef = db.collection('Category').add(category)
            .then(sucesso => {
                console.log('Dados inseridos: ' + sucesso);
            });
    }    

    togglep() {
      this.setState({
        modalp: !this.state.modalp
     });
    }

    togglec() {
      this.setState({
        modalc: !this.state.modalc
     });
    }

    logout() {
        firebase.auth().signOut();
        this.props.history.push('/');
    }

    addPlace() {
        const place = {
            description: 'Parque Munincipal',
            price: 'gratuito',
            openHours: '08:00 - 18:00',
            likes: 624
        };

        const db = firebase.firestore();
        db.settings({
            timestampsInSnapshots: true
        });
        const userRef = db.collection('Places').add(place)
            .then(sucesso => {
                console.log('Dados inseridos: ' + sucesso);
            });
    }

    listPlaces() {
        var ref = firebase.database().ref('places');

        ref.once('value', function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                console.log(childSnapshot.val());
            })
        });

    }

    componentDidMount() {
        const db = firebase.firestore();
        db.collection('Places').get().then((querySnapshot) => {
            const places = [];
            querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());

                    const {categoria, coords, nome, descricao} = doc.data();

                    places.push({
                        key: doc.id,
                        categoria: categoria,
                        coords: coords,
                        nome: nome,
                        descricao: descricao,
                    });


                }
            );

            this.setState({
                places: places,
            });
        }).catch((error) => {
            console.error(error);
        });

        db.collection('Category').get().then((querySnapshot) => {
            const categorias = [];
            querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log(doc.id, " => ", doc.data());

                    const {tipo} = doc.data();

                    categorias.push({
                        tipo: tipo,
                        check: true
                    });


                }
            );

            this.setState({
                categorias: categorias,
            });
        }).catch((error) => {
            console.error(error);
        });

    }

    static defaultProps = {
        center: {lat: -9.665036, lng: -35.731161},
        zoom: 15,
    };

    _handleInputChange = event => {
        const id = event.target.id;
        console.log(id);
    };

    render() {
        // const style = {
        //   width: '50vw',
        //   height: '50vh',
        //   position: 'absolute',
        // };
        return (
          <div className='box'>

          <div className='edition '>
            <AppBar position="static" color="inherit">
              <Toolbar>
                <Button color="inherit" onClick={this.addPlace} type="submit">Register a place</Button>
                <Button color="inherit" onClick={this.togglec} type="text">New Category</Button>
                <Button color="inherit" onClick={this.togglep} type="text">New Place</Button>
                <Button color="inherit" /*onClick={this.listPlaces}*/ href="/map" type="submit">List places</Button>
                <Button color="inherit" onClick={this.logout} type="submit">Logout</Button>
              </Toolbar>
            </AppBar>

            <br/>

            <div>
              {this.state.categorias.map((cat, i) => {
                  return (
                      <div>
                        &ensp;
                          <label>
                              <input type='checkbox' defaultChecked={true} name={cat.tipo} id={i} onChange={this._handleInputChange}/>
                              {cat.tipo}
                          </label>
                      </div>

                  )
              }
          )}
            </div>
          </div>

              {/*<span>{this.state.categorias.get('1')}</span>*/}
            <div className='google-map'>
                <GoogleMapReact
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    bootstrapURLKeys={
                        {key: 'AIzaSyDWc-bIxXW2k_6OEWmHw3Ybf4hHkNqCiBQ'}
                    }>

                    {

                        this.state.places.map((place, i) => {
                            let passar;

                        this.state.categorias.map((categoria, j) => {
                            console.log(place.categoria + ' ... ' + categoria.tipo + '...' + categoria.check);
                            if ((place.categoria == categoria.tipo) && categoria.check == true) {
                                passar = 1;
                                console.log('pass')
                            }
                        });

                        if (passar == 1) {
                                return (

                                    <AnyReactComponent
                                        lat={place.coords.lat}
                                        lng={place.coords.long}
                                        onChildClick={place.descricao}
                                        hover={place.desc}
                                        title={place.nome}
                                    />
                                )
                    } else {
                            console.log('n passou')
                        }
                        passar = 0;

                    })}

                </GoogleMapReact>
            </div>

            <Modal isOpen={this.state.modalp} toggle={this.togglep} className={this.props.className}> {/*Modal de cadastrar lugares*/}
              <ModalHeader toggle={this.togglep}>Register a place</ModalHeader>
              <ModalBody>
                <input
                  className="form-control form-control-lg"
                  value={this.state.placeName}
                  type="text"
                  placeholder="Place"
                  onChange={this.upgradePlace} />          
              </ModalBody>
              <ModalFooter>
                <button class="btn btn-info">Cancel</button>          
                <button onClick={this.addPlace} type="submit" class="btn btn-info">Register</button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.modalc} toggle={this.togglec} className={this.props.className}> {/*Modal de cadastrar categorias*/}
              <ModalHeader toggle={this.togglec}>Register a category</ModalHeader>
              <ModalBody>
                <input
                  className="form-control form-control-lg"
                  value={this.state.categoryName}
                  type="text"
                  placeholder="Category"
                  onChange={this.upgradeCategory} />          
              </ModalBody>
              <ModalFooter>
                <button class="btn btn-info">Cancel</button>          
                <button onClick={this.addCategory} type="submit" class="btn btn-info">Register</button>
              </ModalFooter>
            </Modal>            
        </div>
        );
    }
}
const AnyReactComponent = ({text}) => <div><img src={marker}/></div>;
