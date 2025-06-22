import { Component } from "react";
import Cookies from 'js-cookie'
import { useNavigate } from "react-router-dom";


const withRouter = (WrappedComponent) => {
  return function (props) {
    const navigate = useNavigate();
    return <WrappedComponent {...props} navigate={navigate} />;
  };
};

class Login extends Component{
    state={name: '', password: '', isLoged: false}

    nameSet=(event)=>{
        this.setState({name: event.target.value})
    }

    passwordSet=(event)=>{
        this.setState({password: event.target.value})
    }

    login=()=>{
        const {name, password}=this.state
        if(name && password){
            Cookies.set('jwt_token', password, {expires: 1})
            Cookies.set('name', name, {expires: 1})

            this.props.navigate("/");
        }else{
            alert("---------Error--------")
        }
    }

    render(){
        return(
        <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{border: 'none', boxShadow: '0 30px 20px rgba(0, 0, 0, 0.1)', display: 'flex', padding: '30px', flexDirection: 'column', justifyContent: 'center', marginTop: '10vh'}}>
                <h1 style={{color: '#000043', fontWeight: 'bold', fontSize: '36px', marginTop: '5vh'}}>MediCare Companion</h1>
                <hr style={{height: '4px', marginBottom: '4vh'}}/>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <label htmlFor="name">Name :</label>
                    <input type="text" id='name'
                        onChange={this.nameSet} 
                        placeholder="Enter Your Name Here" 
                        style={{width: '15vw', height: '4vh', border: 'solid', borderRadius: '5px',  borderWidth: '2px', marginLeft: '5px', padding: '5px'}}
                    />
                </div>
                <div style={{marginTop: '3vh', display: 'flex', flexDirection: 'row', }}>
                    <label htmlFor="password">Password :</label>
                    <input type="password" id='password' onChange={this.passwordSet} placeholder="Enter Your password Here" 
                        style={{width: '15vw', height: '4vh', border: 'solid', borderRadius: '5px', borderWidth: '2px', marginLeft: '5px', padding: '5px'}}/>
                </div>
                <div style={{textAlign: 'center'}}>
                    <button onClick={this.login} 
                    style={{marginTop: '4vh', border: 'solid', borderColor: 'blue', backgroundColor: 'blue', padding: '10px', paddingTop: '4px', paddingBottom: '4px', color: '#ffffff', textAlign: 'center'}} type='button'>
                        Login</button>
                </div>
            </div>
        </div>
        )
    }
}

export default withRouter(Login);
