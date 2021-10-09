import React, {Component} from "react";
import {withRouter} from "react-router-dom"

class AuthorizedUser extends Component {

  state = {signingIn: false}

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({signingIn: true})
      const code = window.location.search.replace("?code=", "")
      alert(code)
      this.props.history.replace("/")
    }
  }

  requestCode() {
    let clientID = process.env.REACT_APP_CLIENT_ID
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`
  }

  render() {
    return (
      <button onClick={this.requestCode} disabled={this.state.signingIn}>
        Sign In with GitHub
      </button>
    )
  }
}

export default withRouter(AuthorizedUser)