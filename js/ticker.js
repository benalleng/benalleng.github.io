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
				}, 2000);
			}
		});
	}

	function updateData() {
		const miningAdjustmentPath = "https://mempool.space/api/v1/difficulty-adjustment";
		const pricePath = "https://mempool.space/api/v1/prices";
		const blockTipHeightPath = "https://mempool.space/api/blocks/tip/height";
		const recommendedFeePath = "https://mempool.space/api/v1/fees/recommended";
		const mempoolPath = "https://mempool.space/api/mempool";

		Promise.all([
			fetch(miningAdjustmentPath).then(r => r.json()),
			fetch(pricePath).then(r => r.json()),
			fetch(blockTipHeightPath).then(r => r.json()),
			fetch(recommendedFeePath).then(r => r.json()),
			fetch(mempoolPath).then(r => r.json())
		])
			.then(([miningData, priceData, blockHeightData, recommendedFeeData, mempoolData]) => {
				const priceTextContent =
					`${priceData.USD}`;
				const satsPerDollarTextContent =
					`${Math.round(100000000 / priceData.USD)}`;
				const estimatedDifficultyChangeTextContent =
					`${Number(miningData.difficultyChange).toFixed(1)}%`;
				const retargetHeightTextContent =
					`${miningData.nextRetargetHeight}`;
				const blocksToRetargetTextContent =
					`${miningData.remainingBlocks}`;
				const currentBlockHeightTextContent =
					`${blockHeightData}`;
				const minimumFeeTextContent =
					`${recommendedFeeData.minimumFee} sats/vb`;
				const fastestFeeTextContent =
					`${recommendedFeeData.fastestFee} sats/vb`;
				const mempoolTxCountTextContent =
					`${Number(mempoolData.count)}`;
				const mempoolExpectedBlocksTextContent =
					`${Math.round(mempoolData.vsize / 1000000)}`;
				const mempoolFeesTextContent =
					`${mempoolData.total_fee} sats`;

				updateField("#price", priceTextContent);
				updateField("#sats_per_dollar", satsPerDollarTextContent);
				updateField("#estimated_difficulty_change", estimatedDifficultyChangeTextContent);
				updateField("#retarget_height", retargetHeightTextContent);
				updateField("#blocks_to_retarget", blocksToRetargetTextContent);
				updateField("#current_block_height", currentBlockHeightTextContent);
				updateField("#minimum_fee", minimumFeeTextContent);
				updateField("#fastest_fee", fastestFeeTextContent);
				updateField("#mempool_tx_count", mempoolTxCountTextContent);
				updateField("#mempool_expected_blocks", mempoolExpectedBlocksTextContent);
				updateField("#mempool_fees", mempoolFeesTextContent);
				updateField("#price2", priceTextContent);
				updateField("#sats_per_dollar2", satsPerDollarTextContent);
				updateField("#estimated_difficulty_change2", estimatedDifficultyChangeTextContent);
				updateField("#retarget_height2", retargetHeightTextContent);
				updateField("#blocks_to_retarget2", blocksToRetargetTextContent);
				updateField("#current_block_height2", currentBlockHeightTextContent);
				updateField("#minimum_fee2", minimumFeeTextContent);
				updateField("#fastest_fee2", fastestFeeTextContent);
				updateField("#mempool_tx_count2", mempoolTxCountTextContent);
				updateField("#mempool_expected_blocks2", mempoolExpectedBlocksTextContent);
				updateField("#mempool_fees2", mempoolFeesTextContent);
			})
			.catch(err => {
				console.error("Failed to fetch data from an API.", err);
			});
	}

	updateData();
	setInterval(updateData, 10000);
});
