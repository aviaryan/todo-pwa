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
			<svg className="feather" aria-label="Notifications" role="button"
				onClick={props.subscribed ? props.unsubscribe : props.subscribe}>
				<use xlinkHref={'/img/feather-sprite.svg#bell' + (props.subscribed ? '' : '-off')} />
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

	getLatestTodos() {
		return idbKeyval.get('todos').then(val => {
			return val || this.state.todos
		})
	}

	addTodo(text) {
		this.getLatestTodos().then(todos => {
			this.postTodos([...todos, { title: text, completed: false, id: todos.length + 1 }])
		})
		document.getElementById('todoText').value = ''
	}

	postTodos(todos){
		idbKeyval.set('todos', todos).then(() => {
			navigator.serviceWorker.ready.then(swRegistration => {
				return swRegistration.sync.register('sync')
			})
		}).catch(console.error)
		// allow UI change
		// better way use messages http://craig-russell.co.uk/2016/01/29/service-worker-messaging.html
		this.setState({todos})
	}

	toggleTodo(todoID) {
		this.getLatestTodos().then(todos => {
			let newTodos = todos.map(todo => {
				if (todo.id === todoID) {
					todo.completed = !todo.completed
				}
				return todo
			})
			this.postTodos(newTodos)
		})
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
	state = {login: null, subscribed: false}

	componentDidMount() {
		let setState = this.setState.bind(this)
		navigator.serviceWorker.ready.then((reg) => {
			reg.pushManager.getSubscription().then(function (sub) {
				if (sub) {
					console.log('already subscribed')
					setState({ subscribed: true })
				}
			})
		})
		idbKeyval.get('login').then(login => {
			if (login) {
				this.setState({ login })
			}
		})
	}

	unsubscribeUser() {
		let setState = this.setState.bind(this)
		let login = this.state.login
		navigator.serviceWorker.ready.then(function (reg) {
			reg.pushManager.getSubscription().then(function (subscription) {
				if (subscription) {
					return subscription.unsubscribe();
				}
			}).catch(function (error) {
				console.log('Error unsubscribing', error);
			}).then(function () {
				fetch(SERVER_URL + '/subscribes/' + login, {
					method: 'DELETE',
				}).then(() => {
					console.log('unsubscribed')
				}).catch(console.error)
				setState({subscribed: false})
			});
		})
	}

	subscribeUser() {
		let setState = this.setState.bind(this)
		let login = this.state.login
		if ('serviceWorker' in navigator) {
			console.log('hey')
			navigator.serviceWorker.ready.then(function (reg) {
				reg.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: urlB64ToUint8Array(
						'BDWPiHgC0nNJk7XDu-lt-TsBhWW5Dttc7OvTmiWtiOR-r-xAPn7QnE6lucsVAEZXFoJQjNWQ1ED6POjjiyiiSHw'
					)
				}).then(function (sub) {
					setState({subscribed: true})
					// send data to server
					fetch(SERVER_URL + '/subscribes/' + login, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json; charset=utf-8',
						},
						body: JSON.stringify(sub)
					}).then(() => {
						console.log('subscribed', sub)
					}).catch(console.error)
				}).catch(function (e) {
					if (Notification.permission === 'denied') {
						console.warn('Permission for notifications was denied');
					} else {
						console.error('Unable to subscribe to push', e);
					}
				});
			})
		}
	}

	login(login) {
		idbKeyval.set('login', login)
		this.setState({login})
	}

	logOut() {
		idbKeyval.clear()
		this.setState({login: null})
	}

	render() {
		return (
			<div className="app">
				<Header logOut={this.logOut.bind(this)} login={this.state.login}
					subscribe={this.subscribeUser.bind(this)} unsubscribe={this.unsubscribeUser.bind(this)}
					subscribed={this.state.subscribed} />
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


// HELPER FUNCTIONS
// PAY NO ATTENTION

function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
		.replace(/\-/g, '+')
		.replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}