import styles from './footer.module.css';

export const Footer = () => {
	return (
		<footer className={styles.footer}>
			<p>2022</p>
			<ul>
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						className={styles.link}
						href="https://github.com/rainbowfieldholograph"
					>
						My Github
					</a>
				</li>
			</ul>
		</footer>
	);
};
