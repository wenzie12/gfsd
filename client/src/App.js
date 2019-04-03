import React, { Component } from 'react'
import { Button, Typography, Input, Modal } from 'antd'
import { Row, Col } from 'antd'
import uuid from 'uuid'

import './App.css'

class App extends Component {
  state = {
    appTitle: 'Workout Program',
    day: '',
    name: '',
    workouts: [],
    workoutId: '',
    workoutName: '',
    editWorkout: {
      id: '',
      name: '',
      day: ''
    },
    isVisible: {
      edit: false,
      del: false
    }
  }

  handleCancel = modal => {
    this.setState({ workoutId: '', workoutName: '', day: '', name: '' })
    if (modal === 'edit') return this.setState({ isVisible: { edit: false } })
    this.setState({ isVisible: { del: false } })
  }

  handleChange = (e, changeOn = 'add') => {
    const { workoutId, editWorkout } = this.state

    // Adding workout or editing a workout
    return changeOn === 'add'
      ? this.setState({ [e.target.name]: e.target.value })
      : this.setState({
        editWorkout: {
          id: workoutId,
          day: e.target.name === 'day' ? e.target.value : editWorkout.day,
          name: e.target.name === 'name' ? e.target.value : editWorkout.name
        }
      })
  }

  handleSubmit = e => {
    const { workouts, day, name } = this.state
    const newWorkout = {
      id: uuid(),
      day,
      name
    }

    this.setState({
      ...this.state,
      workouts: [...workouts, newWorkout]
    })

    this.setState({ name: '', day: '' })
  }

  handleEdit = id => {
    const { workouts } = this.state
    const { day, name } = workouts.filter(workout => workout.id === id)[0]

    this.setState({
      workoutId: id,
      isVisible: {
        edit: true
      },
      editWorkout: {
        day,
        name
      }
    })
  }

  handleDelete = id => {
    this.setState({
      workoutId: id,
      isVisible: {
        del: true
      },
      workoutName: this.state.workouts.filter(workout => workout.id === id)[0]
        .name
    })
  }

  confirmDelete = () => {
    const { workoutId, workouts } = this.state

    this.setState({
      workouts: workouts.filter(workout => workoutId !== workout.id)
    })
    this.handleCancel('del')
  }

  handleUpdate = () => {
    const { editWorkout, workouts, workoutId } = this.state

    this.setState({
      ...this.state,
      workouts: workouts.map(workout =>
        workout.id === workoutId ? (workout = editWorkout) : workout
      )
    })
    this.handleCancel('edit')
  }

  render () {
    const { Title } = Typography
    const { edit, del } = this.state.isVisible
    const {
      appTitle,
      workouts,
      name,
      day,
      workoutName,
      editWorkout
    } = this.state

    return (
      <div className='App'>
        <Title level={3}> {appTitle}</Title>
        <br />
        <label>Day:&nbsp;&nbsp;</label>
        <Input
          type='text'
          name='day'
          value={day}
          onChange={this.handleChange}
        />
        <br />
        <label>Workout:&nbsp;&nbsp;</label>
        <Input
          type='text'
          name='name'
          value={name}
          onChange={this.handleChange}
        />
        <br />
        <Button onClick={this.handleSubmit}>Add</Button>

        {workouts.map(workout => (
          <li className='workout' key={workout.id}>
            id: {workout.id}
            {workout.day}: &nbsp;
            {workout.name}
            <i
              className='fas fa-pencil-alt'
              onClick={() => this.handleEdit(workout.id)}
            />
            <i
              className='fas fa-trash-alt'
              onClick={() => this.handleDelete(workout.id)}
            />
          </li>
        ))}

        <Modal
          visible={edit}
          title='Edit'
          onOk={this.handleUpdate}
          onCancel={() => this.handleCancel('edit')}
          footer={[
            <Button key='back' onClick={() => this.handleCancel('edit')}>
              Return
            </Button>,
            <Button key='submit' type='primary' onClick={this.handleUpdate}>
              Submit
            </Button>
          ]}
        >
          <Row>
            <Col>
              <label htmlFor='Day'>Day: </label>
              <Input
                name='day'
                value={editWorkout.day}
                onChange={e => this.handleChange(e, 'edit')}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <label htmlFor='Day'>Workout: </label>
              <Input
                name='name'
                value={editWorkout.name}
                onChange={e => this.handleChange(e, 'edit')}
              />
            </Col>
          </Row>
        </Modal>
        <Modal
          visible={del}
          title='Delete'
          onOk={() => this.confirmDelete()}
          onCancel={() => this.handleCancel('del')}
          okText='Ok'
          cancelText='Cancel'
        >
          <p>Are you sure you want to delete {workoutName}?</p>
        </Modal>
      </div>
    )
  }
}

export default App
