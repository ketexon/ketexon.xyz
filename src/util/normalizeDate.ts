const dateTimeFormat = new Intl.DateTimeFormat(
	"en-GB",
	{
		dateStyle: "long",
	},
)

export default function format(date: string | Date): string {
	if(date instanceof Date) return dateTimeFormat.format(date);
	return format(new Date(date));
}