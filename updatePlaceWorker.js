const { updatePlaceQueue, masterReportQueue } = require('./updatePlaceQueue');
const { Place } = require('./models'); // Import your Place model

// Define the start function for the worker
function start() {
	updatePlaceQueue.process(async (job) => {
		try {
			const { placeId, updatedData } = job.data;

			// Update the Place table with the updated JSON object
			await Place.update(
				{ updated_json: updatedData },
				{ where: { id: placeId } }
			);
		} catch (error) {
			console.error('Error processing job:', error);
		}
	});
	// Process jobs for the masterReportQueue
	// masterReportQueue.process(async (job) => {
	// 	try {
	// 		const { placeId, masterReportData } = job.data;
	// 		// Update the Place table with the master report data
	// 		await Place.update(
	// 			{ master_report_json: masterReportData },
	// 			{ where: { id: placeId } }
	// 		);
	// 	} catch (error) {
	// 		console.error('Error processing masterReportQueue job:', error);
	// 	}
	// });
}

module.exports = { start };
