/**
 * PMO types for schema v1.1.0.
 *
 * Generated from schemas/portable_microhaplotype_object_v1.1.0.schema.json by scripts/generate-types.mjs. Do not edit by hand.
 * Every record allows extra keys because the schema does: builders copy
 * user-chosen "additional" columns into them.
 */

/**
 * Information on final microhaplotype results from a targeted amplicon analysis with associated meta data
 */
export interface PortableMicrohaplotypeObject {
  /**
   * the bioinformatics pipeline/methods used to generated the microhaplotype analysis for this project
   */
  bioinformatics_methods_info?: BioinformaticsMethodInfo[] | null;
  /**
   * the runtime info for the bioinformatics pipeline used to generated the microhaplotypes analysis for this project
   */
  bioinformatics_run_info?: BioinformaticsRunInfo[] | null;
  /**
   * the microhaplotypes detected in this projects
   */
  detected_microhaplotypes: DetectedMicrohaplotypes[];
  /**
   * a list of libraries of all the seq/amp of the specimens within this PMO file
   */
  library_sample_info: LibrarySampleInfo[];
  /**
   * a list of info on the panels
   */
  panel_info: PanelInfo[];
  pmo_header: PmoHeader;
  /**
   * the information about the projects stored in this PMO
   */
  project_info?: ProjectInfo[] | null;
  /**
   * the read counts for library_samples for different stages of the pipeline
   */
  read_counts_by_stage?: ReadCountsByStage[] | null;
  representative_microhaplotypes: RepresentativeMicrohaplotypes;
  /**
   * a list of sequencing infos for this PMO file
   */
  sequencing_info?: SequencingInfo[] | null;
  /**
   * a list of all the specimens within this PMO file
   */
  specimen_info: SpecimenInfo[];
  /**
   * a list of info on the targets
   */
  target_info: TargetInfo[];
  /**
   * a list of genomes that any genomic location information refers to
   */
  targeted_genomes?: GenomeInfo[] | null;
  [k: string]: unknown;
}
/**
 * the targeted amplicon bioinformatics methods used to generate the microhaplotype data in this PMO
 */
export interface BioinformaticsMethodInfo {
  /**
   * methodology used to generate the microhaplotype data stored in this PMO, e.g. demultiplexing method, denosing method, or a pipeline method that ties all th steps together
   */
  methods: BioMethod[];
  [k: string]: unknown;
}
/**
 * bioinformatics methodology description with info on program, version, and arguments different from the default
 */
export interface BioMethod {
  /**
   * any additional arguments that differ from the default arguments
   */
  additional_argument?: string[] | null;
  /**
   * name of the program used for this portion of the pipeline
   */
  program: string;
  /**
   * a short description of what this method does
   */
  program_description?: string | null;
  /**
   * a url pointing to code base of a program, e.g. a github link
   */
  program_url?: string | null;
  /**
   * the version of program, should be in the format of v[MAJOR].[MINOR].[PATCH]
   */
  program_version: string;
  [k: string]: unknown;
}
/**
 * Information about the pipeline run that generated microhaplotype_detected and reads_by_stage
 */
export interface BioinformaticsRunInfo {
  /**
   * the index into the bioinformatics_methods_info list
   */
  bioinformatics_methods_id: number;
  /**
   * a name to for this run, needs to be unique to each run
   */
  bioinformatics_run_name: string;
  /**
   * the date when the run was done, should be YYYY-MM-DD
   */
  run_date?: string | null;
  [k: string]: unknown;
}
/**
 * the microhaplotypes detected in a targeted amplicon analysis
 */
export interface DetectedMicrohaplotypes {
  /**
   * the index into bioinformatics_run_info list
   */
  bioinformatics_run_id?: number | null;
  /**
   * a list of the microhaplotypes detected for all samples with a list for each target
   */
  library_samples: DetectedMicrohaplotypesForSample[];
  [k: string]: unknown;
}
/**
 * Microhaplotypes detected for a sample for all targets
 */
export interface DetectedMicrohaplotypesForSample {
  /**
   * the index into the library_sample_info list
   */
  library_sample_id: number;
  /**
   * a list of the microhaplotypes detected for a list of targets
   */
  target_results: DetectedMicrohaplotypesForTarget[];
  [k: string]: unknown;
}
/**
 * Microhaplotypes detected for a specific target
 */
export interface DetectedMicrohaplotypesForTarget {
  /**
   * a list of the microhaplotypes detected for this target
   */
  mhaps: MicrohaplotypeForTarget[];
  /**
   * the index for a target in the representative_microhaplotypes list
   */
  mhaps_target_id: number;
  [k: string]: unknown;
}
/**
 * Microhaplotype detected for a specific target
 */
export interface MicrohaplotypeForTarget {
  /**
   * the index for a microhaplotype for a target in the representative_microhaplotypes list, e.g. representative_microhaplotypes[mhaps_target_id][mhap_id]
   */
  mhap_id: number;
  /**
   * the read count for this microhaplotype
   */
  reads: number;
  /**
   * the unique molecular identifier (umi) count for this microhaplotype
   */
  umis?: number | null;
  [k: string]: unknown;
}
/**
 * Information about a specific amplification and sequencing of a specimen
 */
export interface LibrarySampleInfo {
  /**
   * a list of alternative names
   */
  alternate_identifiers?: string[] | null;
  /**
   * ERA/SRA experiment accession number for the sample if it was submitted
   */
  experiment_accession?: string | null;
  /**
   * the location (url or filename path) of the fastqs for a library run
   */
  fastqs_loc?: string | null;
  /**
   * plate location of where library was prepared for sequencing
   */
  library_prep_plate_info?: PlateInfo | null;
  /**
   * a unique identifier for this sequencing/amplification run
   */
  library_sample_name: string;
  /**
   * the index into the panel_info list
   */
  panel_id: number;
  /**
   * qpcr parasite density measurement for this extracted sample
   */
  qpcr_parasite_density_info?: ParasiteDensity[] | null;
  /**
   * ERA/SRA run accession number for the sample if it was submitted
   */
  run_accession?: string | null;
  /**
   * the index into the sequencing_info list
   */
  sequencing_info_id?: number | null;
  /**
   * the index into the specimen_info list
   */
  specimen_id: number;
  [k: string]: unknown;
}
/**
 * Information about a plate location, e.g. a standard 96 well plate with row having a letter and column having a number
 */
export interface PlateInfo {
  /**
   * the column position
   */
  plate_col: number;
  /**
   * a name for the plate
   */
  plate_name: string;
  /**
   * the row position
   */
  plate_row: string;
  [k: string]: unknown;
}
/**
 * method and value of determined parasite density
 */
export interface ParasiteDensity {
  /**
   * the date the qpcr was performed, can be YYYY, YYYY-MM, or YYYY-MM-DD
   */
  date_measured?: string | null;
  /**
   * additional comments about how the density was performed
   */
  density_method_comments?: string | null;
  /**
   * the density in microliters
   */
  parasite_density: number;
  /**
   * the method of how this density was obtained
   */
  parasite_density_method: string;
  [k: string]: unknown;
}
/**
 * information on a panel of targeted amplicon primer pairs
 */
export interface PanelInfo {
  /**
   * a name for the panel
   */
  panel_name: string;
  /**
   * a list of 1 or more reactions that this panel contains, each reactions list the targets that were amplified in that reaction, e.g. pool1, pool2
   */
  reactions: ReactionInfo[];
  [k: string]: unknown;
}
/**
 * information on a panel of targeted amplicon primer pairs
 */
export interface ReactionInfo {
  /**
   * a list of the target indexes in the target_info list
   */
  panel_targets: number[];
  /**
   * a name for this reaction
   */
  reaction_name: string;
  [k: string]: unknown;
}
/**
 * the PMO information for this file including version etc
 */
export interface PmoHeader {
  /**
   * the date of when the PMO file was created or modified, should be YYYY-MM-DD
   */
  creation_date?: string | null;
  /**
   * the generation method to create this PMO
   */
  generation_method?: PmoGenerationMethod | null;
  /**
   * the version of the PMO file, should be in the format of v[MAJOR].[MINOR].[PATCH]
   */
  pmo_version: string;
  [k: string]: unknown;
}
/**
 * Information about how a PMO was generated
 */
export interface PmoGenerationMethod {
  /**
   * the name of the program
   */
  program_name: string;
  /**
   * the version of program, should be in the format of v[MAJOR].[MINOR].[PATCH]
   */
  program_version: string;
  [k: string]: unknown;
}
/**
 * Information on a project underwhich a collection of specimens belong to
 */
export interface ProjectInfo {
  /**
   * an SRA bioproject accession e.g. PRJNA33823
   */
  BioProject_accession?: string | null;
  /**
   * can be collection of names separated by a semicolon if multiple people involved or can just be the name of the primary person managing the specimen
   */
  project_collector_chief_scientist?: string | null;
  /**
   * a list of collaborators who contributed to this project
   */
  project_contributors?: string[] | null;
  /**
   * a short description of the project
   */
  project_description: string;
  /**
   * a name for the project, should be unique if multiple projects listed
   */
  project_name: string;
  /**
   * the type of project conducted, e.g. TES vs surveillance vs transmission
   */
  project_type?: string | null;
  [k: string]: unknown;
}
/**
 * Information on the reads counts at several stages of a pipeline
 */
export interface ReadCountsByStage {
  /**
   * the index into bioinformatics_run_info list
   */
  bioinformatics_run_id?: number | null;
  /**
   * a list by library_sample for the counts at each stage
   */
  read_counts_by_library_sample_by_stage: ReadCountsByStageForLibrarySample[];
  [k: string]: unknown;
}
/**
 * Information on the reads counts at several stages of a pipeline for a library_sample
 */
export interface ReadCountsByStageForLibrarySample {
  /**
   * the index into the library_sample_info list
   */
  library_sample_id: number;
  /**
   * a list of counts by stage for a target
   */
  read_counts_for_targets?: ReadCountsByStageForTarget[] | null;
  /**
   * the raw counts off the sequencing machine that a sample began with
   */
  total_raw_count: number;
  [k: string]: unknown;
}
/**
 * Information on the reads counts at several stages of a pipeline for a target
 */
export interface ReadCountsByStageForTarget {
  /**
   * the read counts by each stage
   */
  stages: StageReadCounts[];
  /**
   * the index into the target_info list
   */
  target_id: number;
  [k: string]: unknown;
}
/**
 * Information on the reads counts at several stages
 */
export interface StageReadCounts {
  /**
   * the read counts for this stage
   */
  reads: number;
  /**
   * the stage of the pipeline, e.g. demultiplexed, denoised, etc
   */
  stage: string;
  [k: string]: unknown;
}
/**
 * a list of the information on the representative microhaplotypes
 */
export interface RepresentativeMicrohaplotypes {
  /**
   * a list of the microhaplotypes for each targets
   */
  targets: RepresentativeMicrohaplotypesForTarget[];
  [k: string]: unknown;
}
/**
 * a list of the representative sequence for the microhaplotypes for a target
 */
export interface RepresentativeMicrohaplotypesForTarget {
  /**
   * a genomic location that was analyzed for this target info, this allows listing location that may be different from the full target location (e.g 1 trimmed off the full length)
   */
  mhap_location?: GenomicLocation | null;
  /**
   * a list of all the microhaplotypes for a target
   */
  microhaplotypes: RepresentativeMicrohaplotype[];
  /**
   * the index into the target_info list
   */
  target_id: number;
  [k: string]: unknown;
}
/**
 * information on the genomic location of specific sequence
 */
export interface GenomicLocation {
  /**
   * a possible alternative sequence of this genomic location
   */
  alt_seq?: string | null;
  /**
   * the chromosome name
   */
  chrom: string;
  /**
   * the end of the location, 0-based positioning
   */
  end: number;
  /**
   * the index to the genome in the targeted_genomes list that this location refers to
   */
  genome_id: number;
  /**
   * the reference sequence of this genomic location
   */
  ref_seq?: string | null;
  /**
   * the start of the location, 0-based positioning
   */
  start: number;
  /**
   * which strand the location is, either + for plus strand or - for negative strand
   */
  strand?: string | null;
  [k: string]: unknown;
}
/**
 * the representative sequence for a microhaplotype
 */
export interface RepresentativeMicrohaplotype {
  /**
   * a list of additional annotations associated with this microhaplotype, e.g. wildtype
   */
  alt_annotations?: string[] | null;
  /**
   * a list of protein variants for this haplotype, e.g. amino acid changes/INDELS
   */
  associated_protein_variants?: ProteinVariant[] | null;
  /**
   * a list of sequence variants for this haplotype, e.g. SNPS, indels
   */
  associated_seq_variants?: GenomicLocation[] | null;
  /**
   * masking info for the sequence
   */
  masking?: MaskingInfo[] | null;
  /**
   * an optional name for this microhaplotype
   */
  microhaplotype_name?: string | null;
  /**
   * the pseudocigar of the haplotype
   */
  pseudocigar?: Pseudocigar | null;
  /**
   * the ASCII fastq per base quality score for this sequence, this is optional, must be same length as the sequence
   */
  quality?: string | null;
  /**
   * the sequence
   */
  seq: string;
  [k: string]: unknown;
}
/**
 * information on a variant in protein sequence
 */
export interface ProteinVariant {
  /**
   * an alternative gene name
   */
  alternative_gene_name?: string | null;
  /**
   * the position within the genomic sequence of the codon
   */
  codon_genomic_location?: GenomicLocation | null;
  /**
   * an identifier of the gene, if any, is being covered with this targeted
   */
  gene_name?: string | null;
  protein_location: GenomicLocation1;
  [k: string]: unknown;
}
/**
 * information on the genomic location of specific sequence
 */
export interface GenomicLocation1 {
  /**
   * a possible alternative sequence of this genomic location
   */
  alt_seq?: string | null;
  /**
   * the chromosome name
   */
  chrom: string;
  /**
   * the end of the location, 0-based positioning
   */
  end: number;
  /**
   * the index to the genome in the targeted_genomes list that this location refers to
   */
  genome_id: number;
  /**
   * the reference sequence of this genomic location
   */
  ref_seq?: string | null;
  /**
   * the start of the location, 0-based positioning
   */
  start: number;
  /**
   * which strand the location is, either + for plus strand or - for negative strand
   */
  strand?: string | null;
  [k: string]: unknown;
}
/**
 * information about a subsegment of the sequence that should be masked
 */
export interface MaskingInfo {
  /**
   * a description of how the masking information was generated
   */
  masking_generation_description?: string | null;
  /**
   * the size of replacement mask
   */
  replacement_size: number;
  /**
   * the size of the masking
   */
  seq_segment_size: number;
  /**
   * the start of the masking
   */
  seq_start: number;
  [k: string]: unknown;
}
/**
 * information on pseudocigar for a sequence
 */
export interface Pseudocigar {
  /**
   * a description of how the pseudocigar information was generated
   */
  pseudocigar_generation_description?: string | null;
  /**
   * the pseudocigar itself
   */
  pseudocigar_seq: string;
  ref_loc: GenomicLocation2;
  [k: string]: unknown;
}
/**
 * information on the genomic location of specific sequence
 */
export interface GenomicLocation2 {
  /**
   * a possible alternative sequence of this genomic location
   */
  alt_seq?: string | null;
  /**
   * the chromosome name
   */
  chrom: string;
  /**
   * the end of the location, 0-based positioning
   */
  end: number;
  /**
   * the index to the genome in the targeted_genomes list that this location refers to
   */
  genome_id: number;
  /**
   * the reference sequence of this genomic location
   */
  ref_seq?: string | null;
  /**
   * the start of the location, 0-based positioning
   */
  start: number;
  /**
   * which strand the location is, either + for plus strand or - for negative strand
   */
  strand?: string | null;
  [k: string]: unknown;
}
/**
 * Information on sequencing info
 */
export interface SequencingInfo {
  /**
   * Name, version, and applicable cell or cycle numbers for the kit used to prepare libraries and load cells or chips for sequencing. If possible, include a part number, e.g. MiSeq Reagent Kit v3 (150-cycle), MS-102-3001
   */
  library_kit?: string | null;
  /**
   * Specify the configuration of reads, e.g. paired-end, single
   */
  library_layout: string;
  /**
   * Describe enrichment, screening, or normalization methods applied during amplification or library preparation, e.g. size selection 390bp, diluted to 1 ng DNA/sample
   */
  library_screen?: string | null;
  /**
   * how amplification was done (common are PCR=Source material was selected by designed primers, RANDOM =Random selection by shearing or other method)
   */
  library_selection: string;
  /**
   * Source of amplification material e.g. was it DNA (GENOMIC) or RNA (TRANSCRIPTOMIC) (common names GENOMIC, TRANSCRIPTOMIC)
   */
  library_source: string;
  /**
   * what the nuceloacid sequencing/amplification strategy was (common names are AMPLICON, WGS)
   */
  library_strategy: string;
  /**
   * Link to a reference or kit that describes the enzymatic amplification of nucleic acids
   */
  nucl_acid_amp?: string | null;
  /**
   * the date of the nucleoacid amplification
   */
  nucl_acid_amp_date?: string | null;
  /**
   * Link to a reference or kit that describes the recovery of nucleic acids from the sample
   */
  nucl_acid_ext?: string | null;
  /**
   * the date of the nucleoacid extraction
   */
  nucl_acid_ext_date?: string | null;
  /**
   * the method/conditions for PCR, List PCR cycles used to amplify the target
   */
  pcr_cond?: string | null;
  /**
   * Name of facility where sequencing was performed (lab, core facility, or company)
   */
  seq_center?: string | null;
  /**
   * the date of sequencing, should be YYYY-MM or YYYY-MM-DD
   */
  seq_date?: string | null;
  /**
   * the sequencing instrument model used to sequence the run, e.g. NextSeq 2000, MinION, Revio
   */
  seq_instrument_model: string;
  /**
   * the sequencing technology used to sequence the run, e.g. ILLUMINA, NANOPORE, PACBIO
   */
  seq_platform: string;
  /**
   * a name for a specific sequencing run, e.g. batch1
   */
  sequencing_info_name: string;
  [k: string]: unknown;
}
/**
 * Information on specimen info
 */
export interface SpecimenInfo {
  /**
   * a list of alternative names
   */
  alternate_identifiers?: string[] | null;
  /**
   * whether host specimen has had a recent blood meal  
   */
  blood_meal?: boolean | null;
  /**
   * the name of country collected in, would be the same as admin level 0
   */
  collection_country?: string | null;
  /**
   * the date of the specimen collection, can be YYYY, YYYY-MM, or YYYY-MM-DD
   */
  collection_date?: string | null;
  /**
   * Any drug used by subject and the frequency of usage; can include multiple drugs used
   */
  drug_usage?: string[] | null;
  /**
   * the broad environment from which the specimen was collected, e.g. highlands, lowlands, mountainous region
   */
  env_broad_scale?: string | null;
  /**
   * the local environment from which the specimen was collected, e.g. jungle, urban, rural
   */
  env_local_scale?: string | null;
  /**
   * the environment medium from which the specimen was collected from
   */
  env_medium?: string | null;
  /**
   * geographical admin level 1, the secondary large demarcation of a nation (nation = admin level 0)
   */
  geo_admin1?: string | null;
  /**
   * geographical admin level 2, the third large demarcation of a nation (nation = admin level 0)
   */
  geo_admin2?: string | null;
  /**
   * geographical admin level 3, the third large demarcation of a nation (nation = admin level 0)
   */
  geo_admin3?: string | null;
  /**
   * whether host specimen is currently pregnant
   */
  gravid?: boolean | null;
  /**
   * the gravidity of the specimen host (number of previous pregnancies)
   */
  gravidity?: number | null;
  /**
   * has travelled out from local region in the last six months
   */
  has_travel_out_six_month?: boolean | null;
  /**
   * if specimen is from a person, the age in years of the person, can be float value so for 3 month old put 0.25
   */
  host_age?: number | null;
  /**
   * if specimen is collected from a host with a sex, the sex listed for that host
   */
  host_sex?: string | null;
  /**
   * an identifier for the individual/person/patient a specimen was collected from
   */
  host_subject_name?: string | null;
  /**
   * the NCBI taxonomy number of the host that the specimen was collected from
   */
  host_taxon_id?: number | null;
  /**
   * the latitude and longitude of a specific site
   */
  lat_lon?: string | null;
  /**
   * one or more parasite densities in microliters for this specimen
   */
  parasite_density_info?: ParasiteDensity[] | null;
  /**
   * the index into the project_info list
   */
  project_id?: number | null;
  /**
   * if specimen is deposited in a database, what accession is it associated with
   */
  specimen_accession?: string | null;
  /**
   * the way the specimen was collected, e.g. whole blood, dried blood spot
   */
  specimen_collect_device?: string | null;
  /**
   * any additional comments about the specimen
   */
  specimen_comments?: string[] | null;
  /**
   * an identifier for the specimen, should be unique within this sample set
   */
  specimen_name: string;
  /**
   * the specimen store site, address or facility name
   */
  specimen_store_loc?: string | null;
  /**
   * the NCBI taxonomy number of the organism(s) in the specimen, can list multiple if a mixed sample
   */
  specimen_taxon_id?: number[] | null;
  /**
   * what type of specimen this is, e.g. negative_control, positive_control, field_sample
   */
  specimen_type?: string | null;
  /**
   * plate location of where specimen is stored if stored in a plate
   */
  storage_plate_info?: PlateInfo | null;
  /**
   * Specification of the countries travelled in the last six months; can include multiple travels
   */
  travel_out_six_month?: TravelInfo[] | null;
  /**
   * If person has been treated with drugs, what was the treatment outcome
   */
  treatment_status?: string[] | null;
  [k: string]: unknown;
}
/**
 * Information on travel info
 */
export interface TravelInfo {
  /**
   * approximate usage of bed net while traveling, 1 = 100% nights with bed net, 0 = 0% no bed net usage
   */
  bed_net_usage?: number | null;
  /**
   * geographical admin level 1, the secondary large demarcation of a nation (nation = admin level 0)
   */
  geo_admin1?: string | null;
  /**
   * geographical admin level 2, the third large demarcation of a nation (nation = admin level 0)
   */
  geo_admin2?: string | null;
  /**
   * geographical admin level 3, the third large demarcation of a nation (nation = admin level 0)
   */
  geo_admin3?: string | null;
  /**
   * the latitude and longitude of a specific site
   */
  lat_lon?: string | null;
  /**
   * the name of country, would be the same as admin level 0
   */
  travel_country: string;
  /**
   * the date of the end of travel, can be approximate, should be YYYY-MM or YYYY-MM-DD (preferred)
   */
  travel_end_date: string;
  /**
   * the date of the start of travel, can be approximate, should be YYYY-MM or YYYY-MM-DD (preferred)
   */
  travel_start_date: string;
  [k: string]: unknown;
}
/**
 * Information about a specific targeted microhaplotype
 */
export interface TargetInfo {
  forward_primer: PrimerInfo;
  /**
   * an identifier of the gene, if any, is being covered with this targeted
   */
  gene_name?: string | null;
  /**
   * the intended genomic location of the insert of the amplicon (the location between the end of the forward primer and the beginning of the reverse primer)
   */
  insert_location?: GenomicLocation | null;
  /**
   * a list of markers of interest that are covered by this target
   */
  markers_of_interest?: MarkerOfInterest[] | null;
  reverse_primer: PrimerInfo1;
  /**
   * a list of classification types for this target
   */
  target_attributes?: string[] | null;
  /**
   * a name for this target
   */
  target_name: string;
  [k: string]: unknown;
}
/**
 * the forward primer for this target
 */
export interface PrimerInfo {
  /**
   * what the intended genomic location of the primer is
   */
  location?: GenomicLocation | null;
  /**
   * the sequence
   */
  seq: string;
  [k: string]: unknown;
}
/**
 * A specific genomic location of interest, e.g. drug resistance, or other phenotypical marker
 */
export interface MarkerOfInterest {
  /**
   * a list of associations with this marker, e.g. SP resistance, etc
   */
  associations?: string[] | null;
  marker_location: GenomicLocation3;
  [k: string]: unknown;
}
/**
 * the genomic location
 */
export interface GenomicLocation3 {
  /**
   * a possible alternative sequence of this genomic location
   */
  alt_seq?: string | null;
  /**
   * the chromosome name
   */
  chrom: string;
  /**
   * the end of the location, 0-based positioning
   */
  end: number;
  /**
   * the index to the genome in the targeted_genomes list that this location refers to
   */
  genome_id: number;
  /**
   * the reference sequence of this genomic location
   */
  ref_seq?: string | null;
  /**
   * the start of the location, 0-based positioning
   */
  start: number;
  /**
   * which strand the location is, either + for plus strand or - for negative strand
   */
  strand?: string | null;
  [k: string]: unknown;
}
/**
 * the reverse primer for this target
 */
export interface PrimerInfo1 {
  /**
   * what the intended genomic location of the primer is
   */
  location?: GenomicLocation | null;
  /**
   * the sequence
   */
  seq: string;
  [k: string]: unknown;
}
/**
 * information on a genome
 */
export interface GenomeInfo {
  /**
   * a list of the chromosomes/contigs found within this genome
   */
  chromosomes?: string[] | null;
  /**
   * the genome version
   */
  genome_version: string;
  /**
   * a link to the where this genome's annotation file could be downloaded
   */
  gff_url?: string | null;
  /**
   * name of the genome
   */
  name: string;
  /**
   * the NCBI taxonomy number, can be a list of values if it's a genome file that has been created by combining gnomes from different species
   */
  taxon_id: number[];
  /**
   * a link to the where this genome file could be downloaded
   */
  url: string;
  [k: string]: unknown;
}
