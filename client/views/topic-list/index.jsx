import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import { AppState } from '../../store/app-state';

@inject('appState') @observer
export default class TopicList extends React.Component {
  componentDidMount() {
    // to do
  }

  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true)
      });
    }).catch((e) => {
      console.log(e); // eslint-disabled-line
    })
  }

  changeName = (e) => {
    this.props.appState.changeName(e.target.value);
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        {this.props.appState.msg}
      </div>
    )
  }
}
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}

