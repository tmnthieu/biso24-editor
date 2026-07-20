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

CKEDITOR.plugins.add('pdffile', {
	icons: 'exporttopdf',
	hidpi: true,
	init: function (editor) {
		// add the menu to the editor

		editor.addCommand('exporttopdf', {
			exec: function (editor) {
				const html2pdf = editor.getCommand('html2pdf');
				html2pdf
					.Worker()
					.from(editor.document.$.documentElement.outerHTML || '')
					.save();
			},
		});

		editor.ui.addButton('exporttopdf', {
			label: 'Xuất tệp PDF',
			command: 'exporttopdf',
			className: 'pdffile',
			toolbar: 'others',
		});
	},
});
