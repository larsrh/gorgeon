export default function Exhibit({ caption }, ...children) {
	return <figure>
		{children}
		<figcaption>{caption}</figcaption>
	</figure>;
}
