import React, { Component } from 'react';
import firebase from 'firebase';

export default class Login extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
        email: '',
        senha: ''
    };

    this.loginUsuario = this.loginUsuario.bind(this);
    this.cadastrarUsuario = this.cadastrarUsuario.bind(this);
    this.atualizarEmail = this.atualizarEmail.bind(this);
    this.atualizarSenha = this.atualizarSenha.bind(this);

  }

  atualizarEmail(event){
    this.setState({email: event.target.value});
  }

  atualizarSenha(event){
    this.setState({senha: event.target.value});
  }

  cadastrarUsuario(){
    firebase.auth().createUserWithEmailAndPassword(
      this.state.email,
      this.state.senha
    )
    .then(sucesso => {
      alert('Usuário cadastrado com sucesso!');
    })
    .catch(erro => {
      alert(erro);
    });
  }

  loginUsuario(){
    firebase.auth().signInWithEmailAndPassword(
      this.state.email,
      this.state.senha
    )
    .then(sucesso => {
      this.props.history.push('/home');
    })
    .catch(erro => {
      alert(erro);
    });
  }

  render() {
    return (
      <div>
        <h1>Login!</h1>
        <div>
            <label>
                Email:
                <input type="text" name="email"
                    value={this.state.email} onChange={this.atualizarEmail}/>
            </label>
        </div>
        <div>
            <label>
                Senha:
                <input type="password" name="senha"
                    value={this.state.senha} onChange={this.atualizarSenha}/>
            </label>
        </div>
        <div>
          <a onClick={this.cadastrarUsuario}>Cadastrar</a>
        </div>
        <div>
          <a onClick={this.loginUsuario}>Login</a>
        </div>
      </div>
    );

  }
}
