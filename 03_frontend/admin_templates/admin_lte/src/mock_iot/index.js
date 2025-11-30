// ============================================
// CONSTANTS & CONFIGURATION
// ============================================
const CONFIG = {
	CHART_COLORS: ['#4bc0c0', '#ff6384', '#36a2eb', '#ffce56', '#9966ff', '#ff9f40'],
	MINUTES_PER_POINT: 30,
	TOTAL_DAYS: 7,
	DATE_FORMAT: 'YYYY/MM/DD HH:mm',
	TIME_FORMAT: 'yyyy-MM-dd HH:mm',
};

const MOCK_DEVICES = [
	{ id: 1, name: 'Air Conditioner', roomName: 'Living Room', floorLevel: '2', avgWattHour: 1200, status: 'Online' },
	{ id: 2, name: 'Smart Light', roomName: 'Bedroom', floorLevel: '3', avgWattHour: 60, status: 'Online' },
	{ id: 3, name: 'Thermostat', roomName: 'Living Room', floorLevel: '2', avgWattHour: 15, status: 'Idle' },
	{ id: 4, name: 'Smart Plug', roomName: 'Kitchen', floorLevel: '1', avgWattHour: 300, status: 'Online' },
	{ id: 5, name: 'Security Camera', roomName: 'Entrance', floorLevel: 'G', avgWattHour: 25, status: 'Offline' },
	{ id: 6, name: 'Humidity Sensor', roomName: 'Bathroom', floorLevel: '1', avgWattHour: 5, status: 'Online' },
];

// ============================================
// DATA MODELS
// ============================================
class SensorDataGenerator {
	static generate(deviceId, deviceName) {
		const hasTemp = this._hasTemperatureSensor(deviceName);
		const hasElec = this._hasElectricitySensor(deviceName);

		return {
			temp: hasTemp ? this._generateTemperatureData() : [],
			elec: hasElec ? this._generateElectricityData() : [],
		};
	}

	static _hasTemperatureSensor(deviceName) {
		return deviceName.includes('Air Conditioner') || deviceName.includes('Thermostat') || (!deviceName.includes('Smart Plug') && !deviceName.includes('Smart Light'));
	}

	static _hasElectricitySensor(deviceName) {
		return !deviceName.includes('Security Camera') && !deviceName.includes('Humidity Sensor');
	}

	static _generateTemperatureData() {
		const data = [];
		const now = new Date();
		const totalPoints = CONFIG.TOTAL_DAYS * 24 * (60 / CONFIG.MINUTES_PER_POINT);
		const baseTemp = 25;

		for (let i = totalPoints; i > 0; i--) {
			const timestamp = new Date(now.getTime() - i * CONFIG.MINUTES_PER_POINT * 60000);
			const tempFluctuation = Math.sin(((timestamp.getHours() * 3600 + timestamp.getMinutes() * 60) / 86400) * Math.PI * 2) * 5;

			data.push({
				timestamp: timestamp,
				temp_c: parseFloat((baseTemp + tempFluctuation + (Math.random() - 0.5)).toFixed(2)),
			});
		}
		return data;
	}

	static _generateElectricityData() {
		const data = [];
		const now = new Date();
		const totalPoints = CONFIG.TOTAL_DAYS * 24 * (60 / CONFIG.MINUTES_PER_POINT);
		const baseVolt = 220;
		const baseAmpe = 1.5;

		for (let i = totalPoints; i > 0; i--) {
			const timestamp = new Date(now.getTime() - i * CONFIG.MINUTES_PER_POINT * 60000);
			const volt = parseFloat((baseVolt + (Math.random() - 0.5) * 2).toFixed(2));
			const ampe = parseFloat((baseAmpe + Math.sin(i / 100) + (Math.random() - 0.5) * 0.2).toFixed(2));
			const watt = parseFloat((volt * ampe).toFixed(2));

			data.push({
				timestamp: timestamp,
				volt: volt,
				ampe: ampe,
				watt: watt,
				watt_hour: parseFloat((watt * (CONFIG.MINUTES_PER_POINT / 60)).toFixed(2)),
				hz: 50,
				power_factor: parseFloat((0.9 + Math.random() * 0.1).toFixed(2)),
			});
		}
		return data;
	}
}

// ============================================
// CHART COMPONENTS
// ============================================
class ChartPlugin {
	static peakHighlighter = {
		id: 'peakHighlighterPlugin',
		afterDraw: (chart) => {
			const ctx = chart.ctx;

			chart.data.datasets.forEach((dataset, i) => {
				const meta = chart.getDatasetMeta(i);
				if (meta.type !== 'line' || meta.hidden) return;

				const elements = meta.data;
				const visibleMinX = chart.scales.x.min;
				const visibleMaxX = chart.scales.x.max;

				let peakValue = -Infinity;
				let peakElement = null;
				let troughValue = Infinity; // Thêm biến tìm điểm thấp nhất
				let troughElement = null;

				// Tìm cả điểm cao nhất và thấp nhất
				elements.forEach((element) => {
					const x = element.x;
					if (x >= visibleMinX && x <= visibleMaxX) {
						const y = element.parsed.y;

						// Tìm điểm cao nhất
						if (y > peakValue) {
							peakValue = y;
							peakElement = element;
						}

						// Tìm điểm thấp nhất
						if (y < troughValue) {
							troughValue = y;
							troughElement = element;
						}
					}
				});

				// Vẽ điểm cao nhất (màu đỏ)
				if (peakElement) {
					ctx.save();
					ctx.beginPath();
					ctx.strokeStyle = '#FF0000'; // Màu đỏ cho điểm cao nhất
					ctx.lineWidth = 2;
					ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
					ctx.arc(peakElement.x, peakElement.y, (peakElement.options.radius || 3) + 5, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
					ctx.restore();
				}

				// Vẽ điểm thấp nhất (màu xanh lá)
				if (troughElement && troughElement !== peakElement) {
					ctx.save();
					ctx.beginPath();
					ctx.strokeStyle = '#00FF00'; // Màu xanh lá cho điểm thấp nhất
					ctx.lineWidth = 2;
					ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
					ctx.arc(troughElement.x, troughElement.y, (troughElement.options.radius || 3) + 5, 0, Math.PI * 2);
					ctx.fill();
					ctx.stroke();
					ctx.restore();
				}
			});
		},
	};
}

class ChartManager {
	constructor() {
		this.charts = {};
		this.chartsList = [];
	}

	createChart(canvasId, yAxisLabel) {
		const ctx = document.getElementById(canvasId).getContext('2d');
		const chart = new Chart(ctx, {
			type: 'line',
			data: { datasets: [] },
			options: this._getChartOptions(yAxisLabel),
			plugins: [ChartPlugin.peakHighlighter],
		});

		this.charts[canvasId] = chart;
		this.chartsList.push(chart);
		return chart;
	}

	_getChartOptions(yAxisLabel) {
		return {
			responsive: true,
			maintainAspectRatio: false,
			animation: false,
			parsing: false,
			interaction: {
				mode: 'index',
				intersect: false,
				onHover: (e, elements, chart) => this.syncHover(chart),
			},
			plugins: {
				tooltip: {
					enabled: true,
					backgroundColor: 'rgba(0, 0, 0, 0.8)',
				},
				legend: { position: 'bottom' },
				peakHighlighterPlugin: {},
			},
			scales: {
				x: {
					type: 'time',
					time: {
						unit: 'hour',
						displayFormats: { hour: 'HH:mm', day: 'MMM dd' },
						tooltipFormat: CONFIG.TIME_FORMAT,
					},
					title: { display: true, text: 'Timestamp (Recorded At)' },
					ticks: { display: true },
				},
				y: {
					type: 'linear',
					position: 'left',
					title: { display: true, text: yAxisLabel },
				},
			},
			afterDraw: (chart) => this._handleZoomSync(chart),
		};
	}

	_handleZoomSync(chart) {
		if (chart.scales && chart.scales.x) {
			const { min, max } = chart.scales.x;
			if (chart.lastXMin !== min || chart.lastXMax !== max) {
				chart.lastXMin = min;
				chart.lastXMax = max;
				this.syncZoom(chart);
			}
		}
	}

	syncHover(sourceChart) {
		const tooltip = sourceChart.tooltip;

		if (!tooltip || !tooltip.getActiveElements || !tooltip.getActiveElements().length) {
			this.chartsList.forEach((chart) => {
				if (chart.tooltip) {
					chart.tooltip.setActiveElements([], { x: 0, y: 0 });
				}
			});
			this.chartsList.forEach((chart) => chart.update('none'));
			return;
		}

		const activeElements = tooltip.getActiveElements();
		const activeIndex = activeElements[0].index;
		const activeEvent = activeElements[0].element;

		this.chartsList.forEach((chart) => {
			if (chart === sourceChart) return;

			let correspondingElements = [];
			chart.data.datasets.forEach((dataset, datasetIndex) => {
				const meta = chart.getDatasetMeta(datasetIndex);
				if (meta && meta.data[activeIndex]) {
					correspondingElements.push({ datasetIndex, index: activeIndex });
				}
			});

			if (correspondingElements.length > 0) {
				chart.tooltip.setActiveElements(correspondingElements, activeEvent);
			} else {
				chart.tooltip.setActiveElements([], { x: 0, y: 0 });
			}
			chart.update('none');
		});
	}

	syncZoom(sourceChart) {
		const { min, max } = sourceChart.scales.x;
		this.chartsList.forEach((chart) => {
			if (chart !== sourceChart) {
				chart.scales.x.min = min;
				chart.scales.x.max = max;
				chart.update('none');
			}
		});
	}

	clearAllCharts() {
		this.chartsList.forEach((chart) => {
			if (chart) chart.data.datasets = [];
		});
	}

	updateAllCharts(minTime, maxTime) {
		this.chartsList.forEach((chart) => {
			if (chart) {
				chart.options.scales.x.min = minTime;
				chart.options.scales.x.max = maxTime;
				chart.lastXMin = minTime;
				chart.lastXMax = maxTime;
				chart.update();
			}
		});
	}

	destroy() {
		this.chartsList.forEach((chart) => {
			if (chart) chart.destroy();
		});
		this.charts = {};
		this.chartsList = [];
	}
}

// ============================================
// TABLE MANAGER
// ============================================
class DeviceTableManager {
	constructor(selector, onSelectionChange) {
		this.selector = selector;
		this.onSelectionChange = onSelectionChange;
		this.dataTable = null;
		this.selectedDevices = [];
	}

	initialize(data) {
		this.dataTable = $(this.selector).DataTable({
			data: data,
			columns: this._getColumns(),
			deferRender: true,
			pageLength: 10,
			lengthChange: false,
			ordering: true,
			autoWidth: false,
			info: true,
			searching: true,
		});

		this._attachEventHandlers();
	}

	_getColumns() {
		return [
			{ data: 'name' },
			{ data: 'roomName' },
			{ data: 'floorLevel' },
			{
				data: 'avgWattHour',
				render: (data, type) => (type === 'display' ? `${data} <span>Wh</span>` : data),
			},
			{
				data: 'status',
				render: (data, type) => {
					if (type === 'display') {
						const classMap = {
							Online: 'text-bg-success',
							Offline: 'text-bg-danger',
							Idle: 'text-bg-warning',
						};
						return `<span class="badge ${classMap[data] || 'text-bg-secondary'}">${data}</span>`;
					}
					return data;
				},
			},
			{
				data: null,
				render: () => '<input type="checkbox" class="form-check-input row-checkbox" />',
				className: 'text-center',
				orderable: false,
				searchable: false,
			},
		];
	}

	_attachEventHandlers() {
		$('#select-all').on('click', (e) => this._handleSelectAll(e));

		$(`${this.selector} tbody`).on('click', 'input.row-checkbox', (e) => {
			this._handleRowCheckbox(e);
		});

		this.dataTable.on('draw', () => this._handleTableDraw());
	}

	_handleSelectAll(e) {
		const isChecked = e.target.checked;
		const rows = this.dataTable.rows({ page: 'current' }).nodes();

		$('input.row-checkbox', rows).prop('checked', isChecked);
		$(rows).each((_, row) => {
			const rowData = this.dataTable.row(row).data();
			this._updateSelection(rowData, isChecked);
		});
	}

	_handleRowCheckbox(e) {
		const isChecked = e.target.checked;
		const tr = $(e.target).closest('tr');
		const rowData = this.dataTable.row(tr).data();

		this._updateSelection(rowData, isChecked);
		this._updateSelectAllCheckbox();
	}

	_handleTableDraw() {
		const rows = this.dataTable.rows({ page: 'current' }).nodes();
		let totalOnPage = 0;
		let checkedOnPage = 0;

		$(rows).each((_, row) => {
			const rowData = this.dataTable.row(row).data();
			const $checkbox = $(row).find('input.row-checkbox');
			const isSelected = this.selectedDevices.some((item) => item.id === rowData.id);

			$checkbox.prop('checked', isSelected);
			totalOnPage++;
			if (isSelected) checkedOnPage++;
		});

		$('#select-all').prop('checked', totalOnPage > 0 && totalOnPage === checkedOnPage);
	}

	_updateSelection(rowData, isChecked) {
		const index = this.selectedDevices.findIndex((item) => item.id === rowData.id);

		if (isChecked && index === -1) {
			this.selectedDevices.push(rowData);
		} else if (!isChecked && index > -1) {
			this.selectedDevices.splice(index, 1);
		}

		if (this.onSelectionChange) {
			this.onSelectionChange(this.selectedDevices);
		}
	}

	_updateSelectAllCheckbox() {
		const rows = this.dataTable.rows({ page: 'current' }).nodes();
		const total = $('input.row-checkbox', rows).length;
		const checked = $('input.row-checkbox:checked', rows).length;

		$('#select-all').prop('checked', total > 0 && total === checked);
	}

	getSelectedDevices() {
		return this.selectedDevices;
	}
}

// ============================================
// DATE FILTER
// ============================================
class DateRangeFilter {
	constructor(selector, onApply) {
		this.selector = selector;
		this.onApply = onApply;
		this.picker = null;
	}

	initialize(startDate, endDate) {
		this.picker = $(this.selector).daterangepicker(
			{
				timePicker: true,
				timePicker24Hour: true,
				timePickerIncrement: 30,
				locale: {
					format: CONFIG.DATE_FORMAT,
					applyLabel: 'Áp Dụng',
					cancelLabel: 'Hủy',
				},
				ranges: {
					'Hôm nay': [moment().startOf('day'), moment().endOf('day')],
					'Hôm qua': [moment().subtract(1, 'days').startOf('day'), moment().subtract(1, 'days').endOf('day')],
					'7 ngày qua': [moment().subtract(6, 'days').startOf('day'), moment()],
					'30 ngày qua': [moment().subtract(29, 'days').startOf('day'), moment()],
					'Tháng này': [moment().startOf('month'), moment().endOf('month')],
				},
				startDate: startDate,
				endDate: endDate,
			},
			(start, end) => {
				console.log('Date range selected:', start.format(CONFIG.DATE_FORMAT), 'to', end.format(CONFIG.DATE_FORMAT));
				if (this.onApply) {
					this.onApply(start, end);
				}
			},
		);
	}

	setRange(startDate, endDate) {
		const picker = $(this.selector).data('daterangepicker');
		if (picker) {
			picker.setStartDate(moment(startDate));
			picker.setEndDate(moment(endDate));
		}
	}
}

// ============================================
// MAIN APPLICATION
// ============================================
class DashboardApp {
	constructor() {
		this.chartManager = new ChartManager();
		this.tableManager = null;
		this.dateFilter = null;
		this.fullTimeseriesData = {};
	}

	initialize() {
		// Initialize table
		this.tableManager = new DeviceTableManager('#example2', (devices) => {
			$('#selected-count-span').text(`Số thiết bị đã chọn: ${devices.length}`);
		});
		this.tableManager.initialize(MOCK_DEVICES);

		// Initialize charts
		this.chartManager.createChart('sensorChartTemp', 'Nhiệt độ (°C)');
		this.chartManager.createChart('sensorChartWatt', 'Công suất (W)');
		this.chartManager.createChart('sensorChartVolt', 'Điện áp (V)');
		this.chartManager.createChart('sensorChartAmpe', 'Dòng điện (A)');

		// Initialize date filter
		this.dateFilter = new DateRangeFilter('#date-filter-input', (start, end) => {
			this.chartManager.updateAllCharts(start.valueOf(), end.valueOf());
		});
		this.dateFilter.initialize(moment(), moment());

		// Attach button handler
		$('#show-chart-btn').on('click', () => this.drawCharts());
	}

	drawCharts() {
		const selectedDevices = this.tableManager.getSelectedDevices();

		if (selectedDevices.length === 0) {
			alert('Vui lòng chọn ít nhất một thiết bị.');
			return;
		}

		console.log(
			'Drawing charts for:',
			selectedDevices.map((d) => d.name),
		);
		$('#chart-analysis-section').slideDown();

		this.chartManager.clearAllCharts();
		this.fullTimeseriesData = {};

		// Sử dụng object để có thể pass by reference
		const timeRange = {
			min: new Date(),
			max: new Date(0),
		};
		let colorIndex = 0;

		selectedDevices.forEach((device) => {
			const deviceData = SensorDataGenerator.generate(device.id, device.name);
			this.fullTimeseriesData[device.id] = deviceData;

			const color = CONFIG.CHART_COLORS[colorIndex % CONFIG.CHART_COLORS.length];
			colorIndex++;

			this._addTemperatureDataset(device, deviceData, color, timeRange);
			this._addElectricityDatasets(device, deviceData, colorIndex, timeRange);
		});

		this.dateFilter.setRange(timeRange.min, timeRange.max);
		this.chartManager.updateAllCharts(timeRange.min.getTime(), timeRange.max.getTime());
	}

	_addTemperatureDataset(device, deviceData, color, timeRange) {
		if (deviceData.temp.length === 0) return;

		const tempChartData = deviceData.temp.map((point) => {
			// Cập nhật timeRange (passed by reference)
			if (point.timestamp < timeRange.min) timeRange.min = point.timestamp;
			if (point.timestamp > timeRange.max) timeRange.max = point.timestamp;
			return { x: point.timestamp.getTime(), y: point.temp_c };
		});

		this.chartManager.charts.sensorChartTemp.data.datasets.push({
			label: `${device.name} - Temp (°C)`,
			data: tempChartData,
			borderColor: color,
			backgroundColor: color + '80',
			pointRadius: 1,
			borderWidth: 2,
		});
	}

	_addElectricityDatasets(device, deviceData, colorIndex, timeRange) {
		if (deviceData.elec.length === 0) return;

		const wattData = [],
			voltData = [],
			ampeData = [];

		deviceData.elec.forEach((point) => {
			// Cập nhật timeRange (passed by reference)
			if (point.timestamp < timeRange.min) timeRange.min = point.timestamp;
			if (point.timestamp > timeRange.max) timeRange.max = point.timestamp;
			wattData.push({ x: point.timestamp.getTime(), y: point.watt });
			voltData.push({ x: point.timestamp.getTime(), y: point.volt });
			ampeData.push({ x: point.timestamp.getTime(), y: point.ampe });
		});

		const colorWatt = CONFIG.CHART_COLORS[(colorIndex - 1) % CONFIG.CHART_COLORS.length];
		const colorVolt = CONFIG.CHART_COLORS[colorIndex % CONFIG.CHART_COLORS.length];
		const colorAmpe = CONFIG.CHART_COLORS[(colorIndex + 1) % CONFIG.CHART_COLORS.length];

		this.chartManager.charts.sensorChartWatt.data.datasets.push({
			label: `${device.name} - Watt (W)`,
			data: wattData,
			borderColor: colorWatt,
			backgroundColor: colorWatt + '80',
			pointRadius: 1,
			borderWidth: 2,
		});

		this.chartManager.charts.sensorChartVolt.data.datasets.push({
			label: `${device.name} - Volt (V)`,
			data: voltData,
			borderColor: colorVolt,
			backgroundColor: colorVolt + '80',
			pointRadius: 1,
			borderWidth: 2,
		});

		this.chartManager.charts.sensorChartAmpe.data.datasets.push({
			label: `${device.name} - Ampe (A)`,
			data: ampeData,
			borderColor: colorAmpe,
			backgroundColor: colorAmpe + '80',
			pointRadius: 1,
			borderWidth: 2,
		});
	}
}

// ============================================
// APPLICATION ENTRY POINT
// ============================================
$(function () {
	const app = new DashboardApp();
	app.initialize();
});
