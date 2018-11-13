// remove later
const todos = [
	{
		id: 1,
		title: "Do laundry",
		completed: false
	},
	{
		id: 2,
		title: "Wash the dishes",
		completed: false
	}
]

class TodoItem extends React.Component {
	handleChange(evt) {
		todos[this.props.todo.id - 1].completed = evt.target.checked
		this.props.onUpdate()
	}

	render() {
		return (
			<div className="todo">
				<input className="todoCheck" type="checkbox" checked={this.props.todo.completed} onChange={this.handleChange.bind(this)} />
				<span className={['todoText', this.props.todo.completed ? 'todoChecked' : ''].join(' ')}>
					{this.props.todo.title}
				</span>
			</div>
		)
	}
}

class App extends React.Component {
	state = {todos}

	update() {
		this.setState({todos})
	}

	render() {
		return (
			<div className="app">
				<h1 className="title">TODO App</h1>
				<div className="todoItems">
					{this.state.todos.filter(t => !t.completed).map(todo => <TodoItem key={todo.id} todo={todo} 
						onUpdate={this.update.bind(this)}/>)}
				</div>
				<h2 className="labelFinished">Finished</h2>
				<div className="todoItems">
					{this.state.todos.filter(t => t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
						onUpdate={this.update.bind(this)}/>)}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
