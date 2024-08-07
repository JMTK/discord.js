import {
	ComponentType,
	type APIButtonComponent,
	type APIButtonComponentWithCustomId,
	type APIButtonComponentWithSKUId,
	type APIButtonComponentWithURL,
	type APIMessageComponentEmoji,
	type ButtonStyle,
	type Snowflake,
} from 'discord-api-types/v10';
import {
	buttonLabelValidator,
	buttonStyleValidator,
	customIdValidator,
	disabledValidator,
	emojiValidator,
	urlValidator,
	validateRequiredButtonParameters,
} from '../Assertions.js';
import { ComponentBuilder } from '../Component.js';

/**
 * A builder that creates API-compatible JSON data for buttons.
 */
export class ButtonBuilder extends ComponentBuilder<APIButtonComponent> {
	/**
	 * Creates a new button from API data.
	 *
	 * @param data - The API data to create this button with
	 * @example
	 * Creating a button from an API data object:
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	custom_id: 'a cool button',
	 * 	style: ButtonStyle.Primary,
	 * 	label: 'Click Me',
	 * 	emoji: {
	 * 		name: 'smile',
	 * 		id: '123456789012345678',
	 * 	},
	 * });
	 * ```
	 * @example
	 * Creating a button using setters and API data:
	 * ```ts
	 * const button = new ButtonBuilder({
	 * 	style: ButtonStyle.Secondary,
	 * 	label: 'Click Me',
	 * })
	 * 	.setEmoji({ name: '🙂' })
	 * 	.setCustomId('another cool button');
	 * ```
	 */
	public constructor(data?: Partial<APIButtonComponent>) {
		super({ type: ComponentType.Button, ...data });
	}

	/**
	 * Sets the style of this button.
	 *
	 * @param style - The style to use
	 */
	public setStyle(style: ButtonStyle) {
		this.data.style = buttonStyleValidator.parse(style);
		return this;
	}

	/**
	 * Sets the URL for this button.
	 *
	 * @remarks
	 * This method is only available to buttons using the `Link` button style.
	 * Only three types of URL schemes are currently supported: `https://`, `http://`, and `discord://`.
	 * @param url - The URL to use
	 */
	public setURL(url: string) {
		(this.data as APIButtonComponentWithURL).url = urlValidator.parse(url);
		return this;
	}

	/**
	 * Sets the custom id for this button.
	 *
	 * @remarks
	 * This method is only applicable to buttons that are not using the `Link` button style.
	 * @param customId - The custom id to use
	 */
	public setCustomId(customId: string) {
		(this.data as APIButtonComponentWithCustomId).custom_id = customIdValidator.parse(customId);
		return this;
	}

	/**
	 * Sets the SKU id that represents a purchasable SKU for this button.
	 *
	 * @remarks Only available when using premium-style buttons.
	 * @param skuId - The SKU id to use
	 */
	public setSKUId(skuId: Snowflake) {
		(this.data as APIButtonComponentWithSKUId).sku_id = skuId;
		return this;
	}

	/**
	 * Sets the emoji to display on this button.
	 *
	 * @param emoji - The emoji to use
	 */
	public setEmoji(emoji: APIMessageComponentEmoji) {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).emoji = emojiValidator.parse(emoji);
		return this;
	}

	/**
	 * Sets whether this button is disabled.
	 *
	 * @param disabled - Whether to disable this button
	 */
	public setDisabled(disabled = true) {
		this.data.disabled = disabledValidator.parse(disabled);
		return this;
	}

	/**
	 * Sets the label for this button.
	 *
	 * @param label - The label to use
	 */
	public setLabel(label: string) {
		(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).label = buttonLabelValidator.parse(label);
		return this;
	}

	/**
	 * {@inheritDoc ComponentBuilder.toJSON}
	 */
	public toJSON(): APIButtonComponent {
		validateRequiredButtonParameters(
			this.data.style,
			(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).label,
			(this.data as Exclude<APIButtonComponent, APIButtonComponentWithSKUId>).emoji,
			(this.data as APIButtonComponentWithCustomId).custom_id,
			(this.data as APIButtonComponentWithSKUId).sku_id,
			(this.data as APIButtonComponentWithURL).url,
		);

		return {
			...this.data,
		} as APIButtonComponent;
	}
}
