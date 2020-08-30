import XLSX from 'xlsx';
/* generate an array of column objects */
export const make_cols = refstr => {
	let o = [], C = XLSX.utils.decode_range(refstr).e.c + 1;
        for(var i = 0; i < C; ++i) o[i] = {key:i}
        // console.log(o[0]);
	return o;
};