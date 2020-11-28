import React, { Component } from 'react';

class LayoutChange extends Component {
  render() {
    return (
      <aside
        id='layoutChange'
        onClick={this.props.layoutToggle}
      >
        {this.props.layoutChange ? 'Switch It Back!': 'Switch Layout!'}
      </aside>
    )
  }
}

export default LayoutChange;