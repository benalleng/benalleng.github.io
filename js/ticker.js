u(document).on('DOMContentLoaded', function() {

	function updateField(selector, newText) {
		u(selector).each(node => {
			const oldText = node.textContent.trim();

			if (oldText !== newText.trim()) {
				const oldNum = parseFloat(oldText) || 0;
				const newNum = parseFloat(newText) || 0;

				node.textContent = newText;

				node.classList.remove('up', 'down', 'changed');

				if (!isNaN(newNum) && !isNaN(oldNum)) {
					if (newNum > oldNum) {
						node.classList.add('up', 'changed');
					} else if (newNum < oldNum) {
						node.classList.add('down', 'changed');
					} else if (newNum === oldNum) {
						node.classList.add('unchanged');
					}
				}

				setTimeout(() => {
					node.classList.remove('up', 'down', 'changed', 'unchanged');
				}, 800);
			}
		});
	}

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
				const priceTextContent = `${priceData.USD}`;
				const satsPerDollarTextContent = `${Math.round(100000000 / priceData.USD)}`;
				const estimatedDifficultyChangeTextContent = `${parseFloat(miningData.difficultyChange.toFixed(1))}%`;
				const retargetHeightTextContent = `${miningData.nextRetargetHeight}`;
				const blocksToRetargetTextContent = `${miningData.remainingBlocks}`;
				const currentBlockHeightTextContent = `${blockHeightData}`;
				const minimumFeeTextContent = `${recommendedFeeData.minimumFee} sats/vb`;
				const fastestFeeTextContent = `${recommendedFeeData.fastestFee} sats/vb`;

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
