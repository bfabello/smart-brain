import React from 'react';

class SignIn extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: '',
			signInPassword: '',
			userDetails: ''
		}
	}

	onEmailChange = (event) => {
		this.setState({signInEmail: event.target.value})
	}
	onPasswordChange = (event) => {
		this.setState({signInPassword: event.target.value})
	}
	
	onSubmitSignIn = () => {
		fetch('http://localhost:3002/signin', {
			method: 'POST',
			headers: {				
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword
			})
		})
			.then(response => response.json())
			.then(user => {
				if(user.email === this.state.signInEmail){
					this.props.loadUser(user)
					this.props.onRouteChange('home')
				}else{
					this.setState({userDetails: 'Invalid Credentials'})
					console.log('Invalid Credentials')
				}

			})
			.catch(err => console.log(err));
			// need to fix this bug
			this.props.onRouteChange('home')
	}
				

	render(){
		const { onRouteChange } = this.props;
		return(
			<article className="br3 ba dark-gray b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-3  center">
				<main className="pa4 black-80">
				  <form className="measure">
				    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
				      <legend className="f1 fw6 ph0 mh0">Sign In</legend>
				      <div className="mt3">
				        <label className="db fw6 lh-copy f6" htmlFor="email-address">Email</label>
				        <input 
				        	className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="email" 
				        	name="email-address"  
				        	id="email-address"
				        	onChange={this.onEmailChange}
				        />
				      </div>
				      <div className="mv3">
				        <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
				        <input 
				        	className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" 
				        	type="password" 
				        	name="password"  
				        	id="password"
				        	onChange={this.onPasswordChange}
				        />
				      </div>
				      <label className="pa0 ma0 lh-copy f6 pointer"><input type="checkbox"/> Remember me</label>
				    </fieldset>
				    <div className="center red mb2 b">
				    	{ this.state.userDetails }
				    </div>
				    <div className="">
				      <input 
				      	className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib" 
				      	type="submit" 
				      	value="Sign in"
				      	onClick={this.onSubmitSignIn} 
				      />
				    </div>
				    <div className="lh-copy mt3">
				      <p onClick={() => onRouteChange('register')} href="#0" className="f6 link dim black db pointer">Register</p>
				      <a href="#0" className="f6 link dim black db">Forgot your password?</a>
				    </div>
				  </form>
				</main>
			</article>
		);
	}	
}
export default SignIn;