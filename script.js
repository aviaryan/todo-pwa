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

const Header = (props) => (
	<header>
		<h1 className="title">TODO</h1>
		<div className="icons">
			<svg className="feather">
				<use xlinkHref="/img/feather-sprite.svg#bell-off" />
			</svg>
			<svg className="feather log-out">
				<use xlinkHref="/img/feather-sprite.svg#log-out" />
			</svg>
		</div>
	</header>
)

class Login extends React.Component {
	render() {
		return (
			<div className="loginScreen">
				<h2 className="loginLabel">Enter user name</h2>
				<div className="loginControls">
					<input type="text" id="username" placeholder="Avi" />
					<svg className="feather right-arrow login-button">
						<use xlinkHref="/img/feather-sprite.svg#arrow-right-circle" />
					</svg>
				</div>
			</div>
		)
	}
}

const Content = (props) => (
	<div className="content">
		<div className="todoItems">
			{props.todos.filter(t => !t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
				onUpdate={props.update} />)}
		</div>
		<h2 className="labelFinished">Finished</h2>
		<div className="todoItems">
			{props.todos.filter(t => t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
				onUpdate={props.update} />)}
		</div>
		<div className="newTodo">
			<input type="text" id="todoText" placeholder="Enter todo..." />
			<svg className="feather right-arrow">
				<use xlinkHref="/img/feather-sprite.svg#arrow-right-circle" />
			</svg>
		</div>
	</div>
)

class App extends React.Component {
	state = {todos, loggedIn: true}

	update() {
		this.setState({todos})
	}

	render() {
		return (
			<div className="app">
				<Header />
				{this.state.loggedIn ? <Content todos={this.state.todos} update={this.update.bind(this)} /> : <Login />}
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
