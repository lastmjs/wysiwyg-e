import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-icon/iron-icon.js';
import '@polymer/iron-iconset-svg/iron-iconset-svg.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import '@polymer/paper-menu-button/paper-menu-button.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import { WysiwygTool } from '../wysiwyg-tool.js';
import { WysiwygLocalize } from '../wysiwyg-localize.js';

if (document) {
	var iconset = document.createElement('iron-iconset-svg');
	iconset.setAttribute('size', 24);
	iconset.setAttribute('name', 'wysiwyg-tool-link');

	iconset.innerHTML = `
		<svg>
			<defs>
				<g id="icon">
					<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"></path>
				</g>
			</defs>
		</svg>
	`;

	window.addEventListener('load', () => {
		document.body.appendChild(iconset);
	});
}

class WysiwygToolLink extends WysiwygTool {
	static get template() {
		return html`
			${super.template}
			<style include="iron-flex"></style>
			<paper-tooltip id="tooltip" for="button" position="[[tooltipPosition]]" offset="5">
				<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Link"></wysiwyg-localize>
				<span> (Shift + Alt + A)</span>
			</paper-tooltip>
			<iron-a11y-keys id="a11y" target="[[target]]" keys="shift+alt+a" on-keys-pressed="open"></iron-a11y-keys>
			<paper-menu-button on-opened-changed="_paperDropdownOpenedChanged" id="dropdown" disabled="[[disabled]]" dynamic-align>
				<paper-button disabled="[[disabled]]" id="button" slot="dropdown-trigger">
					<iron-icon icon="wysiwyg-tool-link:icon"></iron-icon>
				</paper-button>
				<div style="padding: 8px 16px 18px 16px;" slot="dropdown-content">
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="URL" localized="{{_localizedUrl}}" hidden></wysiwyg-localize>
					<paper-input label="[[_localizedUrl]]" always-float-label value="{{linkUrl}}" id="url"></paper-input>
					<wysiwyg-localize language="[[language]]" resources="[[resources]]" string-key="Target" localized="{{_localizedTarget}}" hidden></wysiwyg-localize>
					<paper-dropdown-menu label="[[_localizedTarget]]" always-float-label noink on-iron-select="_stopPropagation" on-click="_stopPropagation">
						<paper-listbox class="dropdown-content" selected="{{linkTarget}}" attr-for-selected="target" slot="dropdown-content">
							<paper-item target="_blank">_blank</paper-item>
							<paper-item target="_self">_self</paper-item>
							<paper-item target="_parent">_parent</paper-item>
							<paper-item target="_top">_top</paper-item>
						</paper-listbox>
					</paper-dropdown-menu>
					<div class="horizontal layout">
						<paper-icon-button id="close" icon="wysiwyg-tool:close" on-tap="close"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button hidden$="[[!selectedLink]]" id="remove" icon="wysiwyg-tool:remove" on-tap="remove"></paper-icon-button>
						<div class="flex"></div>
						<paper-icon-button id="updateInsert" icon="wysiwyg-tool:updateInsert" on-tap="updateInsert"></paper-icon-button>
					</div>
				</div>
			</paper-menu-button>
		`;
	}

	static get properties() {
		return {
			linkTarget: {
				type: String,
				value: '_self',
				observer: '_linkTargetChanged'
			},
			linkUrl: {
				type: String,
				value: ''
			},
			selectedLink: {
				type: HTMLAnchorElement,
				computed: '_computeSelectedLink(commonAncestorPath)',
				observer: '_selectedLinkChanged'
			}
		};
	}

	ready() {
		super.ready();

		this.resources = {
			'br': {
				'Link': 'Link',
				'URL': 'URL',
				'Target': 'Alvo'
			},
			'en': {
				'Link': 'Link',
				'URL': 'URL',
				'Target': 'Target'
			},
			'fr': {
				'Link': 'Lien',
				'URL': 'URL',
				'Target': 'Cible'
			},
			'de': {
				'Link': 'Link',
				'URL': 'URL',
				'Target': 'Ziel'
			}
		};

		this.allowedTagNames = ['A'];
	}

	close() {
		this.$.dropdown.close();
	}

	open() {
		this._selectedLinkChanged();
		this.$.dropdown.open();

		setTimeout(
			function () {
				this.$.url.focus();
			}.bind(this),
			100
		);
	}

	remove() {
		if (this.disabled || !this.range0) return;

		if (this.selectedLink) {
			this.selectedLink.parentNode.removeChild(this.selectedLink);
			this._setSelectedLink(null);
		}

		this.close();
	}

	updateInsert(event) {
		if (this.disabled || !this.range0) return;
		var linkUrl = this.linkUrl, linkTarget = this.linkTarget;
		this.close();

		setTimeout(
			function () {
				if (this.selectedLink) {
					this.selectedLink.href = linkUrl;
					this.selectedLink.target = linkTarget;
				} else {
					var link = document.createElement('a');
					link.href = linkUrl;
					this.range0.surroundContents(link);

					setTimeout(
						function () {
							if (this.selectedLink) this.selectedLink.target = linkTarget;
						}.bind(this),
						10
					);
				}
			}.bind(this),
			10
		);
	}
	
	_computeActive(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		return !!this._computeSelectedLink(commonAncestorPath);
	}

	_computeDisabled(range0, selectionRoot, canRedo, canUndo, value, commonAncestorPath, command) {
		if (this._computeSelectedLink(commonAncestorPath)) return false;
		if (!this.range0) return true;
		return !(this.range0.startContainer !== this.range0.endContainer || this.range0.endOffset > this.range0.startOffset);
	}

	_computeSelectedLink(commonAncestorPath) {
		if (commonAncestorPath) {
			for (var i = 0; i < commonAncestorPath.length; i += 1) {
				if (commonAncestorPath[i].tagName === 'A') return commonAncestorPath[i];
			}
		}

		return false;
	}

	_linkTargetChanged() {
		if (['_blank', '_self', '_parent', '_top'].indexOf(this.linkTarget) === -1) {
			this.linkTarget = '_self';
			return;
		}
	}

	_paperDropdownOpenedChanged(event) {
		if (this.$.dropdown.opened) return;
		this.linkUrl = '';
		this.linkTarget = '_self';

		this.dispatchEvent(
			new Event(
				'restore-selection',
				{
					bubbles: true,
					composed: true
				}
			)
		);
	}

	_selectedLinkChanged(event) {
		if (this.selectedLink) {
			this.linkUrl = this.selectedLink.href;
			this.linkTarget = this.selectedLink.target || '_self';
		} else {
			this.linkUrl = '';
			this.linkTarget = '_self';
		}
	}

	_stopPropagation(event) {
		event.stopPropagation();
	}
}

customElements.define('wysiwyg-tool-link', WysiwygToolLink);
