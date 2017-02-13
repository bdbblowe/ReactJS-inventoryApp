import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


import { Table } from 'react-bootstrap'

//Firebase dependencies
var uuid = require('uuid');
var firebase = require('firebase');

//Initialize Firebase
var config = {
  apiKey: "AIzaSyBUvQM5iZW6yTVc4F3Wo86j4XtD-GlG3zM",
  authDomain: "inventory-app-93fcb.firebaseapp.com",
  databaseURL: "https://inventory-app-93fcb.firebaseio.com",
  storageBucket: "inventory-app-93fcb.appspot.com",
  messagingSenderId: "268402280317"
};
firebase.initializeApp(config);



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      submitted: false
    }
  }

  componentDidMount() {
    this._loadFirebaseData();
  }

  //Loading the data from firebase
  _loadFirebaseData() {
    var self = this;

    this.setState({ inventory: [] });

    //Getting data from firebase
    firebase.database().ref().once('value').then((snapshot) => {
      snapshot.forEach(function (data) {
        self.setState({
          inventory: self.state.inventory.concat(data.val())
        });
      });
    });
  }

  _handleClick(event) {
    event.preventDefault()
    console.log(event.target.value);
    //Remove one element
    var uuid = event.target.value
    firebase.database().ref().child('inventoryapp/' + uuid).remove();

    //Render the data
    this._loadFirebaseData();
  }

  render() {
    var inputForm;
    var table;
    var rows;

    inputForm = <span>
      <h2>Please enter your inventory Item</h2>
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type="text" placeholder="Enter Name..." name="name" />
        <input type="text" placeholder="Enter description..." name="description" />
        <input type="text" placeholder="Enter quantity..." name="quantity" />
        <button type="submit">Submit</button>
      </form>
    </span>

    //console.log('how many records I have' + )

    //if (this.state.submitted && this.state.inventory.length) {

    rows = this.state.inventory.map(function (item, index) {
      return Object.keys(item).map(function (s) {
        //console.log("ITEM:" + item[s].name)
        //console.log("ITEM:" + item[s].inventory.name) 
        return (
          //<tr key={index}>
          <tr key={s}>
            <th> {item[s].inventory.name} </th>
            <th> {item[s].inventory.description} </th>
            <th> {item[s].inventory.quantity} </th>
          </tr>
        )
      });
    });




    table = (
      <span>
        <Table striped bordered condensed hover>
          <thead>
            <tr>
              <th> Name </th>
              <th> Description </th>
              <th> Quantity </th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </span>
    )

    

    return (
      <div className="App">
        <div className="App-header">
          <h2>Inventory App</h2>
        </div>
        <div className="text-center">
          {inputForm}
        </div>
        <div>
          {table}
        </div>
      </div>
    );
  }

  //Adding our function that will handle our form submit 
  onSubmit(event) {
    event.preventDefault();

    //Creating our initial variables
    const details = {}
    const id = uuid.v1(); //generating our unique key

    //Go through each element in the form making sure it's an input element
    event.target.childNodes.forEach(function (el) {
      if (el.tagName === 'INPUT') {
        details[el.name] = el.value
      } else {
        el.value = null
      }

      //Adding one more element uuid
      details['uuid'] = id;

    })


    //Saving to firebase
    firebase.database().ref('inventoryapp/' + id).set({
      inventory: details
    })

    this.setState({
      submitted: true
    })

    this._loadFirebaseData();

    // const newInventoryItem = this.state.inventory.slice()

    // if (details.name) {
    //   newInventoryItem.push(details)
    // }

    // this.setState({
    //   inventory: newInventoryItem,
    //   submitted: true
    // })

  }

}

export default App;
