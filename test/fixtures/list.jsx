export default function List({ ordered }, ...children) {
	let items = children.map(item => (
		<li>{item}</li>
	));
	return ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
}
