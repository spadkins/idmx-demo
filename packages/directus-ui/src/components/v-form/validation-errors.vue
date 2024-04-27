<template>
	<v-notice type="danger" class="full selectable">
		<div>
			<p>{{ t('validation_error_heading') || t('validation_errors_notice') }}</p>
			<ul class="validation-errors-list">
				<li v-for="(validationError, index) of validationErrorsWithNames" :key="index">
					<strong class="field" @click="$emit('scroll-to-field', validationError.group || validationError.field)">
						<template v-if="validationError.field && validationError.hidden && validationError.group">
							{{
								`${validationError.fieldName} (${t('hidden_in_group', {
									group: validationError.groupName,
								})})`
							}}
						</template>
						<template v-else-if="validationError.field && validationError.hidden">
							{{ `${validationError.fieldName} (${t('hidden')})` }}
						</template>

            <template v-else-if="validationError.customError">{{ validationError.customErrorMsg }}</template>
						<template v-else-if="validationError.field && !validationError.customError">{{ validationError.fieldName }}</template>

					</strong>
					<span>:&nbsp;</span>
					<template v-if="validationError.customValidationMessage">
						{{ validationError.customValidationMessage }}
						<v-icon
							v-tooltip="
								validationError.code === 'RECORD_NOT_UNIQUE'
									? t('validationError.unique', validationError)
									: t(`validationError.${validationError.type}`, validationError)
							"
							small
							name="help_outline"
						/>
					</template>
					<template v-else>
						<template v-if="validationError.code === 'RECORD_NOT_UNIQUE'">
							{{ t('validationError.unique', validationError) }}
						</template>
						<template v-else-if="!validationError.customError">
							{{ t(`validationError.${validationError.type}`, validationError) }}
						</template>
					</template>
				</li>
			</ul>
		</div>
	</v-notice>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { computed } from 'vue';
import { ValidationError, Field } from '@directus/shared/types';
import { formatFieldFunction } from '@/utils/format-field-function';
import { extractFieldFromFunction } from '@/utils/extract-field-from-function';

interface Props {
	validationErrors: ValidationError[];
	fields: Field[];
}

const props = defineProps<Props>();

defineEmits(['scroll-to-field']);

const { t } = useI18n();

const validationErrorsWithNames = computed<
	(ValidationError & { customErrorMsg: string; customError: boolean; fieldName: string; groupName: string; customValidationMessage: string | null })[]
>(() => {
	return props.validationErrors.map((validationError: any) => {
		const { field: fieldKey, fn: functionName } = extractFieldFromFunction(validationError.field);

    validationError.customError = false;

    if (validationError.stack && validationError.stack.match(/\"groupId\" must be \[0\]/i)) {
      validationError.customError = true;
      validationError.customErrorMsg = t('validation_error_admin');
      //" 161,28: validation_errors_notice: 'The following fields have invalid values:'
    }
		const field = props.fields.find((field) => field.field === fieldKey);
		const group = props.fields.find((field) => field.field === validationError.group);

		let fieldName = field?.name ?? validationError.field;

		if (functionName && field?.collection) {
			fieldName = formatFieldFunction(field.collection, validationError.field);
		}

		return {
			...validationError,
			fieldName,
			groupName: group?.name ?? validationError.group,
			customValidationMessage: field?.meta?.validation_message,
		};
	}) as (ValidationError & { customErrorMsg: string; customError: boolean; fieldName: string; groupName: string; customValidationMessage: string | null })[];
});
</script>

<style lang="scss" scoped>
.validation-errors-list {
	margin-top: 4px;
	padding-left: 28px;

	.field {
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}

	li:not(:last-child) {
		margin-bottom: 4px;
	}
}
</style>
