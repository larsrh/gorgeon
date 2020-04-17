export function Exhibit({ caption }, ...children) {
	return <figure>
		{children}
		<figcaption>{caption}</figcaption>
	</figure>;
}

export function Document({ title, lang = "en" }, ...children) {
	return <>
		<__UnsafeRaw html="<!DOCTYPE html>" />
		<html lang={lang}>
			<head>
				<meta charset="utf-8" />
				<title>{title}</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
			</head>

			<body>
				<h1>{title}</h1>
				{children}
			</body>
		</html>
	</>;
}
