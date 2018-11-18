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
	},
	{
		id: 2,
		title: "A completed task",
		completed: true
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
				<header>
					<h1 className="title">TODO</h1>
					<div className="icons">
						<svg className="feather">
							<use xlinkHref="/img/feather-sprite.svg#bell-off" />
						</svg>
						<svg className="feather log-out">
							<use xlinkHref="/img/feather-sprite.svg#log-out"/>
						</svg>
					</div>
				</header>
				<div className="content">
					<div className="todoItems">
						{this.state.todos.filter(t => !t.completed).map(todo => <TodoItem key={todo.id} todo={todo} 
							onUpdate={this.update.bind(this)}/>)}
					</div>
					<h2 className="labelFinished">Finished</h2>
					<div className="todoItems">
						{this.state.todos.filter(t => t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
							onUpdate={this.update.bind(this)}/>)}
					</div>
					<div className="newTodo">
						<input type="text" id="todoText" placeholder="Enter todo..." />
						<svg className="feather right-arrow">
							<use xlinkHref="/img/feather-sprite.svg#arrow-right-circle" />
						</svg>
					</div>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
