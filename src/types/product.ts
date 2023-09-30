export interface StockItemResponse {
	item_id: number
	product_id: number
	stock_id: number
	qty: number
	is_in_stock: boolean
	is_qty_decimal: boolean
	show_default_notification_message: boolean
	use_config_min_qty: boolean
	min_qty: number
	use_config_min_sale_qty: number
	min_sale_qty: number
	use_config_max_sale_qty: boolean
	max_sale_qty: number
	use_config_backorders: boolean
	backorders: number
	use_config_notify_stock_qty: boolean
	notify_stock_qty: number
	use_config_qty_increments: boolean
	qty_increments: number
	use_config_enable_qty_inc: boolean
	enable_qty_increments: boolean
	use_config_manage_stock: boolean
	manage_stock: boolean
	low_stock_date: null | string // Adjusted the type to allow either null or a string.
	is_decimal_divided: boolean
	stock_status_changed_auto: number
}

export interface Product {
	id: number
	sku: string
	name: string
	attribute_set_id: number
	price: number
	status: number
	visibility: number
	type_id: string
	created_at: string
	updated_at: string
	extension_attributes: ExtensionAttributes
	product_links: any[]
	options: any[]
	media_gallery_entries: MediaGalleryEntry[]
	tier_prices: any[]
	custom_attributes: CustomAttribute[]
	stock?: StockItemResponse
	configurable_products?: Product[]
	promo_price?: number
	is_promo?: boolean
}

interface ExtensionAttributes {
	website_ids: number[]
	category_links: CategoryLink[]
	configurable_product_options: ConfigurableProductOption[]
	configurable_product_links: number[]
}

interface CategoryLink {
	position: number
	category_id: string
}

interface ConfigurableProductOption {
	id: number
	attribute_id: string
	label: string
	position: number
	values: {
		value_index: number
	}[]
	product_id: number
}

interface MediaGalleryEntry {
	id: number
	media_type: string
	label: null | string
	position: number
	disabled: boolean
	types: string[]
	file: string
}

interface CustomAttribute {
	attribute_code: string
	value: string | string[]
}
export interface ProductQuery {
	'searchCriteria[filterGroups][0][filters][0][field]'?: keyof Product | 'entity_id' | 'manufacturer' | 'category_id'

	'searchCriteria[filterGroups][0][filters][0][value]'?: string | number

	'searchCriteria[filterGroups][0][filters][0][condition_type]'?:
		| 'eq'
		| 'like'
		| 'in'
		| 'gt'
		| 'gteq'
		| 'lt'
		| 'lteq'
		| string

	'searchCriteria[sortOrders][0][field]'?: keyof Product

	'searchCriteria[sortOrders][0][direction]'?: string

	'searchCriteria[pageSize]'?: number

	'searchCriteria[currentPage]'?: number

	[query: string]: string | number | undefined
}
