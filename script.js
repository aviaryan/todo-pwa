// remove later
const todos = [
	"Do laundry",
	"Wash the dishes"
]

class TodoItem extends React.Component {
	render() {
		return (
			<div className="todo">
				<input className="todoCheck" type="checkbox"/> <span className="todoText">{this.props.title}</span>
			</div>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<div className="app">
				<h1 className="title">TODO App</h1>
				<div className="todoItems">
					{todos.map(todo => <TodoItem key={todo} title={todo}/>)}
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);
