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

CKEDITOR.plugins.add('justify_group', {
	icons: 'justifycenter',
	hidpi: true,
	init: function (editor) {
		const items = {
			justifyleft: {
				label: editor.lang.common.alignLeft,
				command: 'justifyleft',
				group: 'alignment',
				icon: 'justifyleft',
				order: 1,
			},
			justifyright: {
				label: editor.lang.common.alignRight,
				command: 'justifyright',
				group: 'alignment',
				icon: 'justifyright',
				order: 2,
			},
			justifycenter: {
				label: editor.lang.common.alignCenter,
				command: 'justifycenter',
				group: 'alignment',
				icon: 'justifycenter',
				order: 3,
			},
			justify: {
				label: editor.lang.common.justify,
				command: 'justifyblock',
				group: 'alignment',
				icon: 'justifyblock',
				order: 4,
			},
		};
		editor.addMenuGroup('alignment');
		editor.addMenuItems(items);

		editor.ui.add('justify-dropdown', window.CKEDITOR.UI_MENUBUTTON, {
			label: 'Căn lề văn bản',
			toolbar: 'alignment',
			icon: 'justifycenter',
			onMenu: () => {
				const active = {};

				for (const p in items) {
					active[p] = window.CKEDITOR.TRISTATE_OFF;
				}
				return active;
			},
		});
	},
});
