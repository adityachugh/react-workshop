import React, {Component} from 'react';
import './App.css';
import Message from "./Message";
const {firebase} = window;

class App extends Component {

    firebaseMessagesRef = firebase.database().ref('messages');

    constructor(props) {
        super(props);
        this.state = {
            currentMessage: '',
            messages: []
        };
    }

    componentWillMount() {
        this.firebaseMessagesRef.on('child_added', (data) => {
            const newMessages = [data.val().message].concat(this.state.messages);
            this.setState({
                messages: newMessages
            })
        });
    }

    render() {
        return (
            <div className="app">
                <div className="container">

                    <div className="title-container">
                        <h1>Message Board</h1>
                    </div>

                    <div className="new-message-container">
                        <div className="col-xs-12">
                            <div className="input-group">
                                <input value={this.state.currentMessage}
                                       onChange={this.currentMessageChanged.bind(this)}
                                       type="text" className="form-control" placeholder="Message"/>
                                <span className="input-group-btn">
                                <button onClick={this.postMessage.bind(this)} className="btn btn-primary" type="button">Post</button>
                              </span>
                            </div>
                        </div>
                    </div>

                    <div className="messages-container">
                        {this.renderMessages()}
                    </div>

                </div>
            </div>
        );
    }

    renderMessages() {
        const messages = [];
        this.state.messages.forEach((message) => {
            messages.push(
                <div className="col-xs-12 col-sm-6 col-md-4">
                    <Message message={message}/>
                </div>
            )
        });
        return messages;
    }

    currentMessageChanged(event) {
        this.setState({
            currentMessage: event.target.value
        });
    }

    postMessage(event) {
        const newMessage = this.firebaseMessagesRef.push();
        const time = Math.round((new Date()).getTime() / 1000);
        newMessage.set({
            message: this.state.currentMessage,
            createdAt: time
        });
        this.setState({
            currentMessage: ''
        });
    }
}

export default App;