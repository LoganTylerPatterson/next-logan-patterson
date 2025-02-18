"use client"
import { useRef, useEffect} from 'react';
import Branch from './branch.js';

export default function Branches() {
	const canvasRef = useRef(null);
	const branchesRef = useRef([]);

	useEffect(() => {
		const canvasEl = canvasRef.current;
		const context = canvasEl.getContext("2d");
		const WIDTH = window.innerWidth;
		const HEIGHT = window.innerHeight;

		canvasEl.width = WIDTH;
		canvasEl.height = HEIGHT;

		context.fillStyle = "hsl(0, 0, 0)";
		context.fillRect(0, 0, WIDTH, HEIGHT);

		let animationFrameId;

		const loop = () => {
			context.beginPath();

		    context.fillStyle = "rgba(0, 25, 25, 0.05)";
		    context.fillRect(0, 0, WIDTH, HEIGHT);

			for (let i = 0; i < branchesRef.current.length; i++) {
				const branch = branchesRef.current[i];
		        branch.life++;

		        // Set individual branch color
		        context.strokeStyle = branch.color;
		        
		        // Store current position before updating
		        const oldX = branch.x;
		        const oldY = branch.y;

		        // Update position
		        branch.rw += Math.random() - 0.5;
		        branch.x += Math.cos(branch.rw) * branch.speed;
		        branch.y += Math.sin(branch.rw) * branch.speed;

		        // Draw individual path for each branch segment
		        context.beginPath();
		        context.moveTo(oldX, oldY);
		        context.lineTo(branch.x, branch.y);
		        context.stroke();

		        if (branch.life > branch.max_life || 
		            branch.x < 0 || branch.y < 0 || 
		            branch.x > WIDTH || branch.y > HEIGHT) {
		            branchesRef.current.splice(i, 1);
		        }

		        if (Math.random() > 0.95 && branchesRef.current.length < 1000) {
		            branchesRef.current.push(new Branch(branch.x, branch.y, branch.max_life / 10, branch.color));
		        }
			}
			animationFrameId = requestAnimationFrame(loop);
		}

		animationFrameId = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(animationFrameId);
	}, []);

	function createBranch(e) {
		const x = e.clientX;
		const y = e.clientY;

		branchesRef.current.push(new Branch(x, y, 1000));
	}

	return (
		<>
        	<canvas ref={canvasRef} onClick={createBranch} className="w-screen h-schreen"/>
		</>
	)
}
