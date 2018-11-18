const SERVER_URL = 'https://www.jsonstore.io/df5d931f3d12b166bdd9acc7b21c5346be91e20f272bd41857a8b7edb0897e21'

class TodoItem extends React.Component {
	render() {
		return (
			<div className="todo">
				<input className="todoCheck" type="checkbox" checked={this.props.todo.completed} 
					onChange={() => this.props.toggle(this.props.todo.id)} />
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
		{props.login &&
		<div className="icons">
			<svg className="feather">
				<use xlinkHref="/img/feather-sprite.svg#bell-off" />
			</svg>
			<svg className="feather log-out" aria-label="Logout" role="button"
				onClick={props.logOut}>
				<use xlinkHref="/img/feather-sprite.svg#log-out" />
			</svg>
		</div>}
	</header>
)

class Login extends React.Component {
	render() {
		return (
			<div className="loginScreen">
				<h2 className="loginLabel">Enter user name</h2>
				<div className="loginControls">
					<input type="text" id="username" placeholder="Avi" />
					<svg className="feather right-arrow login-button" aria-label="Login" role="button"
						onClick={() => this.props.login(document.getElementById('username').value)}>
						<use xlinkHref="/img/feather-sprite.svg#arrow-right-circle" />
					</svg>
				</div>
			</div>
		)
	}
}

class Content extends React.Component {
	state = {todos: []}

	componentDidMount() {
		this.fetchTodos()
	}

	fetchTodos() {
		fetch(SERVER_URL + '/todos/' + this.props.login).then(res => res.json()).then(obj => {
			this.setState({todos: obj.result || []})
		})
	}

	addTodo(text) {
		this.postTodos([...this.state.todos, { title: text, completed: false, id: this.state.todos.length + 1 }])
	}

	postTodos(todos){
		fetch(SERVER_URL + '/todos/' + this.props.login, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json; charset=utf-8',
			},
			body: JSON.stringify(todos)
		}).then(() => {
			this.fetchTodos()
			document.getElementById('todoText').value = ''
		}).catch(console.error)
	}

	toggleTodo(todoID) {
		let todos = this.state.todos.map(todo => {
			if (todo.id === todoID) {
				todo.completed = !todo.completed
			}
			return todo
		})
		this.postTodos(todos)
	}

	render() {
		return (
			<div className="content">
				<div className="todoItems">
					{this.state.todos.filter(t => !t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
						toggle={this.toggleTodo.bind(this)} />)}
				</div>
				<h2 className="labelFinished">Finished</h2>
				<div className="todoItems">
					{this.state.todos.filter(t => t.completed).map(todo => <TodoItem key={todo.id} todo={todo}
						toggle={this.toggleTodo.bind(this)} />)}
				</div>
				<div className="newTodo">
					<input type="text" id="todoText" placeholder="Enter todo..." />
					<svg className="feather right-arrow" aria-label="Add new todo" role="button"
						onClick={() => this.addTodo(document.getElementById('todoText').value)}>
						<use xlinkHref="/img/feather-sprite.svg#arrow-right-circle" />
					</svg>
				</div>
			</div>
		)
	}
}

class App extends React.Component {
	state = {login: null}

	componentDidMount() {
		const login = localStorage.getItem('login')
		if (login) {
			this.setState({login})
		}
	}

	login(login) {
		localStorage.setItem('login', login)
		this.setState({login})
	}

	logOut() {
		localStorage.clear()
		this.setState({login: null})
	}

	render() {
		return (
			<div className="app">
				<Header logOut={this.logOut.bind(this)} login={this.state.login} />
				{this.state.login ? 
					<Content login={this.state.login} /> : 
					<Login login={this.login.bind(this)} />}
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

// SERVICE WORKER INSTALL

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function () {
		navigator.serviceWorker.register('/sw.js').then(function (registration) {
			// Registration was successful
			console.log('ServiceWorker registration successful with scope: ', registration.scope);
		}, function (err) {
			// registration failed :(
			console.log('ServiceWorker registration failed: ', err);
		});
	});
}
