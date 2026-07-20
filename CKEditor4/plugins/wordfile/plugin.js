/**
 * A plugin to enable placeholder tokens to be inserted into the CKEditor message. Use on its own or with teh placeholder plugin.
 * The default format is compatible with the placeholders syntex
 *
 * @version 0.1
 * @Author Troy Lutton
 * @license MIT
 *
 * This is a pure modification for the placeholders plugin. All credit goes to Stuart Sillitoe for creating the original (stuartsillitoe.co.uk)
 *
 */
const INSERTHTMLFILE_ALLOWED_EXTENSIONS = ['docx', 'txt']; //, 'txt', 'htm', 'html'

CKEDITOR.plugins.add('wordfile', {
	icons: 'exporttoword,importfromword',
	hidpi: true,
	init: function (editor) {
		// add the menu to the editor

		editor.addCommand('exporttoword', {
			exec: function (editor) {
				const preHtml = `
			<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
			<head><meta charset="utf-8"><title></title></head><body>`;
				const postHtml = '</body></html>';
				const html = preHtml + (editor.getData() || '').toString() + postHtml;

				const blob = new Blob(['\ufeff', html], {
					type: 'application/msword',
				});

				const link = document.createElement('a');
				link.href = URL.createObjectURL(blob);
				link.download = 'document.doc';
				link.click();
			},
		});

		// editor.ui.addButton('exporttoword', {
		// 	label: 'Xuất tệp Word',
		// 	command: 'exporttoword',
		// 	className: 'wordfile',
		// 	toolbar: 'others',
		// });

		const inputElement = document.createElement('input');
		inputElement.type = 'file';
		inputElement.style.display = 'none';
		inputElement.id = 'importfromword-input';
		inputElement.setAttribute('accept', INSERTHTMLFILE_ALLOWED_EXTENSIONS.map((item) => `.${item}`).toString());
		inputElement.onchange = async (event) => {
			var file = event.target.files[0];
			var fileUrl = URL.createObjectURL(file);
			var extension = file.name.split('.').pop();
			var rawFile = new XMLHttpRequest();

			if (INSERTHTMLFILE_ALLOWED_EXTENSIONS.indexOf(extension) == -1) {
				var extList = '';
				for (var i in INSERTHTMLFILE_ALLOWED_EXTENSIONS) {
					if (extList != '') {
						extList = extList + ', ';
					}
					extList = extList + INSERTHTMLFILE_ALLOWED_EXTENSIONS[i];
				}
				alert(lang.extensionError + ' ' + extList + '');
				return;
			}

			if (['docx', 'doc'].includes(extension) && editor.getCommand('docx')) {
				const docx = editor.getCommand('docx');
				const tempContainer = document.createElement('div');
				docx
					.renderAsync(await (await fetch(fileUrl)).arrayBuffer(), tempContainer, null, {
						className: '',
						useBase64URL: true,
						breakPages: true,
						inWrapper: false,
						ignoreWidth: true,
						ignoreHeight: true,
						renderHeaders: false,
						renderFooters: false,
						trimXmlDeclaration: true,
					})
					.then((x) => {
						const spans = tempContainer.querySelectorAll('span');

						spans.forEach((span) => {
							if (span.querySelector('div') && span.children.length === 1) {
								const div = document.createElement('div');

								for (let i = 0; i < span.attributes.length; i++) {
									div.setAttribute(span.attributes[i].name, span.attributes[i].value);
								}

								while (span.firstChild) {
									div.appendChild(span.firstChild);
								}

								span.parentNode.replaceChild(div, span);
							}
						});
						const pTags = tempContainer.querySelectorAll('p');

						pTags.forEach((pTag) => {
							if (pTag.querySelector('div') && pTag.children.length === 1) {
								const div = document.createElement('div');

								for (let i = 0; i < pTag.attributes.length; i++) {
									div.setAttribute(pTag.attributes[i].name, pTag.attributes[i].value);
								}

								while (pTag.firstChild) {
									div.appendChild(pTag.firstChild);
								}

								pTag.parentNode.replaceChild(div, pTag);
							}
						});

						const htmlValue = tempContainer.innerHTML;
						editor.setData(htmlValue.replaceAll('application/octet-stream;', 'image/png;'));
					});
			} else {
				rawFile.open('GET', fileUrl, false);
				rawFile.onreadystatechange = function () {
					if (rawFile.readyState === 4) {
						if (rawFile.status === 200 || (rawFile.status == 0 && rawFile.responseText.length > 0)) {
							editor.insertHtml(rawFile.responseText);
						}
					}
				};
				rawFile.send(null);
			}
		};

		editor.addCommand('importfromword', {
			exec: function (editor) {
				const element = editor.element.$.querySelector('#importfromword-label');
				if (element) {
					editor.element.$.appendChild(inputElement);
					element.click();
					editor.element.$.removeChild(inputElement);
				}
			},
		});
		editor.ui.addButton('importfromword', {
			label: 'Nhập tệp Word',
			className: 'wordfile',
			toolbar: 'others',
			command: 'importfromword',
		});
	},

	afterInit: function (editor) {
		const labelElement = document.createElement('label');
		labelElement.setAttribute('for', 'importfromword-input');
		labelElement.id = 'importfromword-label';

		editor.element.$.appendChild(labelElement);
	},
});
