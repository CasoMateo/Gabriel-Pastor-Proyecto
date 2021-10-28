import React, { Component } from 'react';
import ReactDOM from 'react-dom'; 

class ToDo extends Component {
  
  state = { text : this.props.text };

  styles = { 
    display: flex
  }

  render() {
    return {

      <div style = { styles }>

        <h4> 
          { this.state.text }
        </h4> 

        <button class = 'checked'>
          Check 
        </button>

        <button class = 'checked' onClick = { this.props.isChecked }> 
          Delete
        </button>

      </div>
      
    }

  }
}

export default ToDo;