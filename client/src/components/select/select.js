import React, { Component } from 'react';
import axios from 'axios';
import { WithContext as ReactTags } from 'react-tag-input';
import * as constants from '../../constants';
import './select.scss';
import DOCLoading from '../doc-loading';

const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Select extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      suggestions: [],
      error: null,
      loaded: false,
      // invalid: false, // invalid ID warning will appear if true
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
  }

  componentDidMount() {
    axios.get(`${constants.BACKEND_URL}/users`).then((response) => {
      const parsedData = response.data.filter(user => user.email).map((user) => {
        return { id: user._id, text: user.email };
      });
      this.setState({ suggestions: parsedData });
      this.setState({ tags: this.props.currentLeaders.map(leader => ({ id: leader, text: leader })) });
      this.setState({ loaded: true });
    });
  }

  handleDelete(idxToDelete) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, idx) => {
        return idx !== idxToDelete;
      }),
    }, () => this.props.updateLeaderValue(this.state.tags));
  }

  handleAddition(tag) {
    // console.log(this.state.suggestions.find((sugg) => { return sugg.text === tag.text; }));
    if (typeof (this.state.suggestions.find((sugg) => { return sugg.text === tag.text; })) !== 'undefined') {
      this.setState(state => ({ tags: [...state.tags, tag] }), () => this.props.updateLeaderValue(this.state.tags));
    } else {
      // this.setState({ invalid: true });
      // setTimeout(() => { // Animation lasts 1.5 secs
      //   this.setState({ invalid: false });
      // }, 1500);
    }
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <div className='doc-select'>
        {/* <h1 className='invalid-email'>
          {this.state.invalid ? '* Invalid email *' : null}
        </h1> */}
        <ReactTags
          placeholder={this.props.placeholder}
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          delimiters={delimiters}
          allowDragDrop={false}
          minQueryLength={1}
          // allowUnique
          inputFieldPosition='top'
        />
        {!this.state.loaded
          ? <DOCLoading type='spin' width={18} height={18} className='select-loading' />
          : null
        }
      </div>
    );
  }
}

export default Select;
