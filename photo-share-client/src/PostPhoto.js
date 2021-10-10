import React, {Component} from "react";

export default class PostPhoto extends Component {

  state = {
    name: '',
    description: '',
    category: 'PORTRAIT',
    file: ''
  }

  postPhoto = (mutation) => {
    console.log('todo: post photo')
    console.log(this.state)
  }

  render() {
    return (
      <form onSubmit={e => e.preventDefault()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'flex-start'
            }}>

        <h1>写真を投稿する</h1>

        <input type="text"
               style={{margin: '10px'}}
               placeholder="写真の名称..."
               value={this.state.name}
               onChange={({target}) =>
                 this.setState({name: target.value})}/>

        <textarea type="text"
                  style={{margin: '10px'}}
                  placeholder="写真の詳細..."
                  value={this.state.description}
                  onChange={({target}) =>
                    this.setState({description: target.value})}/>

        <select value={this.state.category}
                style={{margin: '10px'}}
                onChange={({target}) =>
                  this.setState({category: target.value})}>
          <option value="PORTRAIT">PORTRAIT</option>
          <option value="LANDSCAPE">LANDSCAPE</option>
          <option value="ACTION">ACTION</option>
          <option value="GRAPHIC">GRAPHIC</option>
        </select>

        <input type="file"
               style={{margin: '10px'}}
               accept="image/jpeg"
               onChange={({target}) =>
                 this.setState({
                   file: target.files && target.files.length ?
                     target.files[0] :
                     ''
                 })}/>

        <div style={{margin: '10px'}}>
          <button onClick={() => this.postPhoto()}>
            写真を投稿する
          </button>
          <button onClick={() => this.props.history.goBack()}>
            キャンセル
          </button>
        </div>

      </form>
    )
  }
};