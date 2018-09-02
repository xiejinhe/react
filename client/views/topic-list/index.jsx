import React from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Button from 'material-ui/Button';
import { AppState } from '../../store/app-state';

@inject('appState') @observer
export default class TopicList extends React.Component {
  componentDidMount() {
    // to do
  }

  bootstrap() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.props.appState.count = 3;
        resolve(true)
      });
    }).catch((e) => {
      throw new Error('bootstrap 异常')
    })
  }

  changeName = (e) => {
    this.props.appState.changeName(e.target.value);
  }
  render() {
    return (
      <div>
        <Helmet>
          <title>Thsi is topic list</title>
          <meta name="decription" content="This is description" />
        </Helmet>
        <Button raised color="primary">This is a button</Button>
        <input type="text" onChange={this.changeName} />
        {this.props.appState.msg}
      </div>
    )
  }
}
TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}

