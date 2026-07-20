CKEDITOR.plugins.add('custompaste', {
	requires: 'clipboard',
	init: function (editor) {
		const isLink = (str) => {
			var urlRegex =
				'^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';
			var url = new RegExp(urlRegex, 'i');
			return str.length < 2083 && url.test(str);
		};

		// Load for non-IE.
		if (CKEDITOR.env.ie) return;
		editor.on('paste', (e) => {
			if (e.data?.type === 'html') {
				const dataTransfer = e.data.dataTransfer;
				let htmlValue = dataTransfer.getData('text/html');
				// let filesCount = dataTransfer.getFilesCount();
				if (
					htmlValue &&
					e.editor.activeFilter &&
					e.editor.activeFilter.check('img[src]') &&
					CKEDITOR.pasteFilters.image
				) {
					const listImages = CKEDITOR.pasteFilters.image.extractTagsFromHtml(htmlValue);
					const rtfData = dataTransfer.getData('text/rtf');
					htmlValue =
						0 === listImages.length
							? htmlValue
							: rtfData
								? CKEDITOR.pasteFilters.image.format(htmlValue, rtfData, listImages)
								: CKEDITOR.pasteFilters.image.formatBlob(e.editor, htmlValue, listImages);
				}
				var filter = new CKEDITOR.filter(true);
				filter.allow({
					$1: {
						elements: CKEDITOR.dtd,
						attributes: true,
						styles: true,
						classes: true,
					},
				});
				var fragment = CKEDITOR.htmlParser.fragment.fromHtml(htmlValue);
				var writer = new CKEDITOR.htmlParser.basicWriter();
				filter.applyTo(fragment);
				fragment.writeHtml(writer);
				if (htmlValue) {
					//filesCount === 1
					e.data.dataValue = writer.getHtml();
				}
			} else if (e.data?.type === 'text') {
				if (e.data.dataValue && isLink(e.data.dataValue)) {
					e.data.dataValue = `<a href="${e.data.dataValue}">${e.data.dataValue}</a>`;
				}
			}
		});
	},
});
