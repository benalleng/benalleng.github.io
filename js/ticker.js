u(document).on('DOMContentLoaded', function() {

	function updateData() {
		const miningAdjustmentPath = "https://mempool.space/api/v1/difficulty-adjustment";
		const pricePath = "https://mempool.space/api/v1/prices";
		const blockTipHeightPath = "https://mempool.space/api/blocks/tip/height";
		const recommendedFeePath = "https://mempool.space/api/v1/fees/recommended";

		Promise.all([
			fetch(miningAdjustmentPath).then(r => r.json()),
			fetch(pricePath).then(r => r.json()),
			fetch(blockTipHeightPath).then(r => r.json()),
			fetch(recommendedFeePath).then(r => r.json())
		])
			.then(([miningData, priceData, blockHeightData, recommendedFeeData]) => {
				const priceTextContent = `${priceData.USD} -\u00A0`;
				const satsPerDollarTextContent = `${Math.round(100000000 / priceData.USD)} -\u00A0`;
				const estimatedDifficultyChangeTextContent = `${parseFloat(miningData.difficultyChange.toFixed(1))}% -\u00A0`;
				const retargetHeightTextContent = `${miningData.nextRetargetHeight} -\u00A0`;
				const blocksToRetargetTextContent = `${miningData.remainingBlocks} -\u00A0`;
				const currentBlockHeightTextContent = `${blockHeightData} -\u00A0`;
				const minimumFeeTextContent = `${recommendedFeeData.minimumFee} sats/vb -\u00A0`;
				const fastestFeeTextContent = `${recommendedFeeData.fastestFee} sats/vb -\u00A0`;

				const updateField = (selector, text) => {
					u(selector).html(text);
				};

				updateField("#price", priceTextContent);
				updateField("#sats_per_dollar", satsPerDollarTextContent);
				updateField("#estimated_difficulty_change", estimatedDifficultyChangeTextContent);
				updateField("#retarget_height", retargetHeightTextContent);
				updateField("#blocks_to_retarget", blocksToRetargetTextContent);
				updateField("#current_block_height", currentBlockHeightTextContent);
				updateField("#minimum_fee", minimumFeeTextContent);
				updateField("#fastest_fee", fastestFeeTextContent);
				updateField("#price2", priceTextContent);
				updateField("#sats_per_dollar2", satsPerDollarTextContent);
				updateField("#estimated_difficulty_change2", estimatedDifficultyChangeTextContent);
				updateField("#retarget_height2", retargetHeightTextContent);
				updateField("#blocks_to_retarget2", blocksToRetargetTextContent);
				updateField("#current_block_height2", currentBlockHeightTextContent);
				updateField("#minimum_fee2", minimumFeeTextContent);
				updateField("#fastest_fee2", fastestFeeTextContent);
			})
			.catch(err => {
				console.error("Failed to fetch data from an API.", err);
			});
	}

	updateData();
	setInterval(updateData, 60000);
});
