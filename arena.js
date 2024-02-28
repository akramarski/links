// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'grid-core-urhajk-yqde' // The “slug” is just the end of the URL

// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.getElementById('title-homepage')
	//let channelDescription = document.getElementById('channel-description')
	let channelCount = document.getElementById('channel-count')
	let channelLink = document.getElementById('channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	//channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	//channelCount.innerHTML = data.length
	//channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.getElementById('channel-blocks')


	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li class="block block--link project fade-effect ">
				
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">Visit link</a></p>
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src=${ block.image.large.url }>
				</picture>
				
				
			</li>
			
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}



	// Images!
	else if (block.class == 'Image') {
		let imageItem =
			`
			<li class="block block--image block-image small fade-effect ">
                    <figure>
                    <img src=${ block.image.large.url }>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
                </figure>
                </li>
			<div class="block--image__description">  </div>
			`
		channelBlocks.insertAdjacentHTML('beforeend', imageItem)
	
	}
	// Text!
	else if (block.class == 'Text') {
		// …up to you!
		let textItem =
			`
			<li class="block block--text block-text fade-effect">
			${ block.content_html }
                </li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', textItem)
	}



	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
					<p><em></em></p>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
			let pdfItem = 
			`
			<li class="block block--pdf pdf-container fade-effect ">
				<iframe src="${block.attachment.url}" style="width:33,3%; height:400px;"></iframe>
				<iframe src="${block.attachment.url}" style="width:33,3%; height:400px;"></iframe>

			</li>
		`;
		channelBlocks.insertAdjacentHTML('beforeend', pdfItem);
			
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				<li>
					<p><em>Audio</em></p>
					<audio controls src="${ block.attachment.url }" ></audio>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
		if (embed.includes('video')) {
			// …still up to you, but here’s an example `iframe` element:
			let linkedVideoItem =
			
				`
				<li class="block block--video container-for-video iframe fade-effect "> 
					${ block.embed.html } 
				
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
			// More on iframe: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe
		}

		

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
		}
	}
}
 


// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})

		// Also display the owner and collaborators:
		let channelUsers = document.getElementById('channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})

	const videoId = "${ block.embed.html }"; 
	const playButton = document.querySelector('#playButton'); 
	
	playButton.addEventListener('click', () => {
		let videoIframe = `
			<iframe 
				width="560" 
				height="315" 
				src="${ block.embed.html } " 
				frameborder="0" 
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
				allowfullscreen>
			</iframe>`;
		document.querySelector('.container-for-video').innerHTML = videoIframe; 
	});
	

	document.querySelectorAll('.container-for-video iframe').forEach(iframe => {
		iframe.addEventListener('click', () => {
		  iframe.style.filter = 'none';
		});
	  });

	  document.addEventListener('DOMContentLoaded', () => {
		let titleHomepage = document.querySelector('#title-homepage');
		const observer = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					titleHomepage.classList.add('fade-out');
				} else {
					titleHomepage.classList.remove('fade-out');
				}
			});
		}, { threshold: 0.1 });
	
		document.querySelectorAll('Image').forEach(image => {
			observer.observe(image);
		});
	});

	