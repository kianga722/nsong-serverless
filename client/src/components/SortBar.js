import React, { Component } from 'react';

class SortBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownDateShow: false
    };
  }

  dropdownToggle = () => {
    this.setState({
      dropdownDateShow: !this.state.dropdownDateShow
    })
  }

  renderDropdown = () => {
    return (
      <ul
        className='dropdown slideDown'
      >
        <li
          className='dropdown-item'
          onClick={() => {
            this.props.dateSortNewest(true);
            this.dropdownToggle();
          }}
        >
          {this.props.sortDateNewest ? <span className='dropdown-current'></span> : <span className='dropdown-empty'></span>} 
          <span>Date (Newest First)</span>
        </li>
        <li
          className='dropdown-item'
          onClick={() => {
            this.props.dateSortNewest(false);
            this.dropdownToggle();
          }}
        >
          {this.props.sortDateNewest ? <span className='dropdown-empty'></span> : <span className='dropdown-current'></span>} 
          <span>Date (Oldest First)</span>
        </li>
      </ul>
    )
  }

  // Close dropdown when clicking outside of dropdown
  handleClick = (e) => {
    if (this.node.contains(e.target)) {
      return;
    }
    this.setState({
      dropdownDateShow: false
    })
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClick, false);
  }



  render() {
    return (
      <div id='sortBar'>

        <div id='logo'>
          <a href='https://nsong.herokuapp.com'
          >
            nsong
          </a>
        </div>

        <ul id='sort-options'>
          <li id='groupChannels'>
            <label htmlFor='groupChannelsSort'>
              <input
                type='checkbox'
                id='groupChannelsSort'
                checked={this.props.groupChannels}
                onChange={this.props.groupChannelsEnable}
              />
              <span className="checkCustomGroup"></span>
              <span>Group By Channel</span>
            </label>
          </li>
          
          <li
            id='dateSort'
            onClick={this.dropdownToggle}
            ref={node => this.node = node}
          >
            <div className='dropdownToggle'>
              <span>
              {this.props.sortDateNewest ? 'Date (Newest First)' : 'Date (Oldest First)'}
              </span>
              {this.state.dropdownDateShow ? <i className='arrow up'></i> : <i className='arrow down'></i>}
              
            </div>
            {this.state.dropdownDateShow ? this.renderDropdown() : <ul className='dropdown'></ul>}
          </li>
        </ul>
      
      </div>
    )
  }
}

export default SortBar;