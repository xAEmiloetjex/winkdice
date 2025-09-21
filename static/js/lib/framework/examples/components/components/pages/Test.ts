import { html } from '../../framework';
import type { IReturns } from '../../framework';

export function TestPage(parent: string) {
    html(parent).set(`
    <style>
	div {
		border: 1px #fff solid;
		border-radius: 10px;
		padding: 1em;
	}
	.d1 {
		background: var(--theme-accent-1);
	}
	.d2 {
		background: var(--theme-accent-2);
	}
	.d3 {
		background: var(--theme-accent-3);
	}
	.d4 {
		background: var(--theme-accent-4);
	}
	.d5 {
		background: var(--theme-accent-5);
		padding: 10%;
	}

    #main, .root-container, .nav-container, .page-container, .topnav {
        padding: 0;
        border: none;
    }
</style>
<section class="sctn_1">
	<div class="container">
		<h1>Preview</h1>
		<h1>Typography</h1>
		<p>
			Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi
			perspiciatis iste a, quisquam nemo aut sit eligendi exercitationem iure
			tempore laborum necessitatibus ab odio ad, veniam debitis voluptatibus
			possimus perferendis. This is <strong>strong</strong>, this is
			<b>bold</b>, this is <em>emphasized</em>, and this is
			<a href="#">linked</a>.
		</p>
		<h1>Heading 1</h1>
		<h2>Heading 2</h2>
		<h3>Heading 3</h3>
		<h4>Heading 4</h4>
		<h5>Heading 5</h5>
		<h6>Heading 6</h6>
		<blockquote
			cite="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote"
		>
			<p>
				"The HTML blockquote Element (or HTML Block Quotation Element) indicates
				that the enclosed text is an extended quotation. Usually, this is
				rendered visually by indentation (see
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote#Usage_notes"
				>
					Notes
				</a>
				for how to change it). A URL for the source of the quotation may be
				given using the <code>cite</code> attribute, while a text representation
				of the source can be given using the <code>&lt;cite&gt;</code> cite
				element."
			</p>
			<footer><cite>MDN, "The Block Quotation element"</cite></footer>
		</blockquote>
		<p>
			This is <code>inline-code</code>, this is <kbd>CTRL+C</kbd> (keyboard) and
			this is a block of preformatted text:
		</p>
		<pre><code lang="js">// Hello World in Javascript
		function main() {
		  console.log('Hello World');
		}
		
		main();</code></pre>
		<p>This is an unordered list:</p>
		<ul>
			<li><p>Item A</p></li>
			<li><p>Item B</p></li>
			<li><p>Item C</p></li>
		</ul>
		<p>This is an ordered list:</p>
		<ol>
			<li><p>Item 1</p></li>
			<li><p>Item 2</p></li>
			<li><p>Item 3</p></li>
		</ol>
		<h1>Forms</h1>
		<form method="get" action="/">
			<header>Basic Form Fields</header>
			<flex-break></flex-break>
			<p>
				This form has some basic fields such as: <code>text</code>,
				<code>password</code>, <code>disabled</code>, <code>reset</code> and
				<code>submit</code>.
			</p>
			<flex-break></flex-break> <label for="text">Text Field:</label>
			<input
				id="text"
				type="text"
				name="text"
				placeholder="Insert some text..."
			/>
			<label for="password">Password Field:</label>
			<input
				id="password"
				type="password"
				name="password"
				placeholder="Insert a password..."
			/>
			<label for="textarea">Textarea Field:</label>
			<textarea
				id="textarea"
				type="textarea"
				name="textarea"
				placeholder="Insert some text..."
			></textarea>
			<label for="disabled">Disabled Field:</label>
			<input id="disabled" type="password" disabled /> <input type="submit" />
			<input type="reset" />
		</form>
		<footer>
			Made with the CSS Library Template on
			<a href="https://replit.com">Replit</a>
		</footer>
	</div>
	<hr />
	<div class="d1">
		<div class="d2">
			<div class="d3">
				<div class="d4">
					<div class="d5"></div>
				</div>
			</div>
		</div>
	</div>
	<hr />
	<section>
		<div class="form">
			<select name="theme" id="theme">
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
			<select name="colorscheme" id="colorscheme">
				<option value="blue">Blue (Default)</option>
				<option value="green">Green</option>
				<option value="yellow">Yellow</option>
				<option value="orange">Orange</option>
				<option value="red">Red</option>
				<option value="purple">Purple</option>
				<option value="brown">Brown</option>
				<option value="monochrome">monochrome (opposite of the background shades)</option>
				<option value="blue">-------------</option>
				<option value="rainbow">Rainbow (v1-Alpha)</option>
				<option value="rainbowv2">Rainbow (v2-Beta) [LAG WARNING!]</option>
			</select>
		</div>
	</section>
</section>
    `)
    return ""
}