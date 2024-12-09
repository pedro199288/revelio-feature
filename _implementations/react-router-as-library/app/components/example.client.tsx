import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Revelio } from "revelio-feature";

export function ExampleClient() {
	const tour = new Revelio({
		journey: [
			{
				title: "Welcome to the app",
				content: "This is the first step of the tour, open the dialog",
				element: "#dialog-trigger",
				options: {
					persistBlink: true,
					requireClickToGoNext: true,
					goNextOnClick: true,
					showNextBtn: false,
				},
			},
			{
				title: "The dialog",
				content: "This is the second step of the tour, the dialog",
				element: "#dialog-content",
			},
			{
				title: "The button",
				content: "This is the third step of the tour, the button",
				element: "#dialog-button",
			},
			{
				title: "The end",
				content: "Close the dialog clicking here",
				element: "#dialog-content button.absolute",
				options: {
					persistBlink: true,
				},
			},
		],
	});

	return (
		<div className="flex flex-col gap-4">
			<Button onClick={() => tour.start()}>Start tour</Button>

			<Dialog>
				<DialogTrigger id="dialog-trigger">Open</DialogTrigger>
				<DialogContent id="dialog-content">
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will permanently delete your
							account and remove your data from our servers.
							<Button id="dialog-button">Button</Button>
						</DialogDescription>
					</DialogHeader>
				</DialogContent>
			</Dialog>
		</div>
	);
}
