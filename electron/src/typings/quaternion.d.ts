declare module 'quaternion' {
    export class Quaternion {
        constructor( w?: number, x?: number, y?: number, z?: number );
        constructor( w: string );
        constructor( w: object );

        /**
         * Adds two quaternions Q1 and Q2
         *
         * @param {Quaternion} q Quaternion to add
         * @returns {Quaternion}
         */
        add( q: Quaternion ): Quaternion;

        /**
         * Subtracts a quaternions Q2 from Q1
         *
         * @param {Quaternion} q Quaternion to subtract
         * @returns {Quaternion}
         */
        sub( q: Quaternion ): Quaternion;

        /**
         * Calculates the additive inverse, or simply it negates the quaternion
         *
         * @returns {Quaternion}
         */
        neg(): Quaternion;

        /**
         * Calculates the length/modulus/magnitude or the norm of a quaternion
         *
         * @returns {number}
         */
        norm(): number;

        /**
         * Calculates the squared length/modulus/magnitude or the norm of a quaternion
         *
         * @returns {number}
         */
        normSq(): number;

        /**
         * Normalizes the quaternion to have |Q| = 1 as long as the norm is not zero
         * Alternative names are the signum, unit or versor
         *
         * @returns {Quaternion}
         */
        normalize(): Quaternion;

        /**
         * Calculates the Hamilton product of two quaternions
         * Leaving out the imaginary part results in just scaling the quat
         *
         * @param {Quaternion} q Quaternion to multiply
         * @returns {Quaternion}
         */
        mul( q: Quaternion ): Quaternion;

        /**
         * Scales a quaternion by a scalar, faster than using multiplication
         *
         * @param {number} s scaling factor
         * @returns {Quaternion}
         */
        scale( s: number ): Quaternion;

        /**
         * Calculates the dot product of two quaternions
         *
         * @param {Quaternion} q Quaternion
         * @returns {number}
         */
        dot( q: Quaternion ): Quaternion;

        /**
         * Calculates the inverse of a quat for non-normalized quats such that
         * Q^-1 * Q = 1 and Q * Q^-1 = 1
         *
         * @returns {Quaternion}
         */
        inverse(): Quaternion;

        /**
         * Multiplies a quaternion with the inverse of a second quaternion
         *
         * @param {Quaternion} q Quaternion
         * @returns {Quaternion}
         */
        div( q: Quaternion ): Quaternion;

        /**
         * Calculates the conjugate of a quaternion
         *
         * @returns {Quaternion}
         */
        conjugate(): Quaternion;

        /**
         * Calculates the natural exponentiation of the quaternion
         *
         * @returns {Quaternion}
         */
        exp(): Quaternion;

        /**
         * Calculates the natural logarithm of the quaternion
         *
         * @returns {Quaternion}
         */
        log(): Quaternion;

        /**
         * Calculates the power of a quaternion raised to a real number or another quaternion
         *
         * @param {Quaternion} q Quaternion
         * @returns {Quaternion}
         */
        pow( q: Quaternion ): Quaternion;

        /**
         * Checks if two quats are the same
         *
         * @param {Quaternion} q Quaternion
         * @returns {boolean}
         */
        equals( q: Quaternion ): boolean;

        /**
         * Checks if all parts of a quaternion are finite
         *
         * @returns {boolean}
         */
        isFinite(): boolean;

        /**
         * Checks if any of the parts of the quaternion is not a number
         *
         * @returns {boolean}
         */
        isNaN(): boolean;
        
        /**
         * Gets the Quaternion as a well formatted string
         *
         * @returns {string}
         */
        toString(): string;
        
        /**
         * Returns the real part of the quaternion
         *
         * @returns {number}
         */
        real(): number;

        /**
         * Returns the imaginary part of the quaternion as a 3D vector / array
         *
         * @returns {Array}
         */
        imag(): [ x: number, y: number, z: number ];
        
        /**
         * Gets the actual quaternion as a 4D vector / array
         *
         * @returns {Array}
         */
        toVector(): [ w: number, x: number, y: number, z: number ];
        
        /**
         * Calculates the 3x3 rotation matrix for the current quat
         *
         * @param {boolean=} d2
         * @see https://en.wikipedia.org/wiki/Rotation_matrix#Quaternion
         * @returns {Array}
         */
        toMatrix( d2: boolean ): number[];

        /**
         * Calculates the homogeneous 4x4 rotation matrix for the current quat
         *
         * @param {boolean=} d2
         * @returns {Array}
         */
        toMatrix4( d2: boolean ): number[];
        
        /**
         * Clones the actual object
         *
         * @returns {Quaternion}
         */
        clone(): Quaternion;

        /**
         * Rotates a vector according to the current quaternion, assumes |q|=1
         * @link https://www.xarg.org/proof/vector-rotation-using-quaternions/
         *
         * @param {Array} v The vector to be rotated
         * @returns {Array}
         */
        rotateVector( vector: [ x: number, y: number, z: number ] ): [ x: number, y: number, z: number ];

        /**
         * Returns a function to spherically interpolate between two quaternions.
         * Called with a percentage [0-1], the function returns the interpolated Quaternion.
         *
         * @param {Quaternion} q Quaternion
         */
        slerp( q: Quaternion ): ( pct: number ) => Quaternion;

        /**
         * Creates quaternion by a rotation given as axis-angle orientation
         *
         * @param {Array} axis The axis around which to rotate
         * @param {number} angle The angle in radians
         * @returns {Quaternion}
         */
        static fromAxisAngle( axis: [ a: number, b: number, c: number ], angle: number ): Quaternion;

        /**
         * Calculates the quaternion to rotate one vector onto the other
         *
         * @param {Array} u
         * @param {Array} v
         */
        static fromBetweenVectors( u: [ x: number, y: number, z: number ], v: [ x: number, y: number, z: number ] ): Quaternion;

        /**
         * Gets a spherical random number
         * @link http://planning.cs.uiuc.edu/node198.html
         */
        static random(): Quaternion;

        /**
         * Creates a quaternion by a rotation given by Euler angles
         *
         * @param {number} phi
         * @param {number} theta
         * @param {number} psi
         * @param {string=} order
         * @returns {Quaternion}
         */
        static fromEuler( phi: number, theta: number, psi: number, order: string ): Quaternion;
    }
}